package service

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/EgorTarasov/true-tech/backend/internal/shared/constants"
)

// TODO: вынести структуры вк
type vkCodeResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int64  `json:"expires_in"`
	UserId      int64  `json:"user_id"`
}

type vkUserResponse struct {
	Response []struct {
		ID    int64  `json:"id"`
		Bdate string `json:"bdate"` // FIXME
		City  struct {
			ID    int64  `json:"id"`
			Title string `json:"title"`
		} `json:"city"`
		Photo200 string `json:"photo_200"`
		Schools  []struct {
			City          int64  `json:"city"`
			Class         string `json:"class"`
			ClassID       int64  `json:"class_id"`
			Country       int64  `json:"country"`
			ID            string `json:"id"`
			Name          string `json:"name"`
			YearFrom      int64  `json:"year_from"`
			YearGraduated int64  `json:"year_graduated"`
			YearTo        int64  `json:"year_to"`
		} `json:"schools"`
		Sex             constants.Sex `json:"sex"`
		FirstName       string        `json:"first_name"`
		LastName        string        `json:"last_name"`
		CanAccessClosed bool          `json:"can_access_closed"`
		IsClosed        bool          `json:"is_closed"`
	} `json:"response"`
}

// parseBirthDate преобразование даты рождения вк в time.Time
//
// https://dev.vk.com/ru/reference/objects/user#bdate
// string Дата рождения. Возвращается в формате D.M.YYYY или D.M (если год рождения скрыт).
// Если дата рождения скрыта целиком, поле отсутствует в ответе.
func parseBirthDate(bDate string) time.Time {
	var birthDate time.Time

	// d.m.yyyy
	if len(strings.Split(bDate, ".")) == 3 {
		birthDate, _ = time.Parse("02-01-2006", bDate)
	} else {
		//d.m
		bDate += ".1970"
		birthDate, _ = time.Parse("02-01-2006", bDate)
	}

	return birthDate

}

//	getVkUserData обработка flow для авторизации вк и получения access_token
//
// для получения информации для аккаунта в системе
// https://oauth.vk.com/access_token?client_id=%s&client_secret=%s&redirect_uri=%s&code=%s
func (s *service) getVkUserData(ctx context.Context, accessCode string) (vkUserResponse, error) {
	ctx, span := s.tracer.Start(ctx, "service.getVkUserData")
	defer span.End()

	client := http.Client{
		Timeout: 0,
	}
	vkAccessTokenUrl := fmt.Sprintf(s.cfg.VkAuth.VkTokenUrl, s.cfg.VkAuth.VkClientId, s.cfg.VkAuth.VkSecureToken, s.cfg.VkAuth.VkRedirectUri, accessCode)

	var (
		response vkCodeResponse
		userData vkUserResponse
	)

	resp, err := client.Get(vkAccessTokenUrl)
	if err != nil {
		return userData, fmt.Errorf("err during vk auth %v", err.Error())
	}

	rawBytes, err := io.ReadAll(resp.Body)
	_ = resp.Body.Close()
	if err != nil {
		return userData, fmt.Errorf("err during vk auth token %v", err.Error())
	}
	if err = json.Unmarshal(rawBytes, &response); err != nil {
		return userData, fmt.Errorf("err during vk decoding json %v", err.Error())
	}

	rawBytes = nil
	requestUrl := "https://api.vk.ru/method/users.get?fields=photo_200,sex,city,bdate,schools&v=5.199"

	req, err := http.NewRequest(http.MethodGet, requestUrl, nil)
	if err != nil {
		return userData, fmt.Errorf("err during vk encoding url %v", err.Error())
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", response.AccessToken))

	resp, err = client.Do(req)
	if err != nil {
		return userData, fmt.Errorf("err during vk getting info: %v", err.Error())
	}

	rawBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		return userData, fmt.Errorf("err during vk user info: %v", err.Error())
	}

	_ = resp.Body.Close()

	err = json.Unmarshal(rawBytes, &userData)
	if err != nil {
		return userData, fmt.Errorf("err during vk user decoding json %v", err.Error())
	}

	return userData, nil
}
