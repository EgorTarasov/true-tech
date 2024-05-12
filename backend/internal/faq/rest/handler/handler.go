package handler

import (
	"context"
	"log"

	"github.com/EgorTarasov/true-tech/backend/internal/faq/models"
	"github.com/gofiber/contrib/websocket"
)

type service interface {
	RespondStream(ctx context.Context, query string, respCh chan<- models.MlResponse, errCh chan<- error)
}

type faqHandler struct {
	s service
}

func NewFaqHandler(s service) *faqHandler {
	return &faqHandler{s}
}

func (h *faqHandler) RespondStream(c *websocket.Conn) {

	// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index
	var (
		err    error
		respCh = make(chan models.MlResponse)
		errCh  = make(chan error)
	)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		log.Println("start")
	sending:
		for {
			select {
			case resp := <-respCh:
				if err = c.WriteJSON(resp); err != nil {
					log.Println("write:", err)
					break sending
				}
			case err := <-errCh:
				log.Println("error:", err)
			}
		}

	}()

	for {
		var req models.MlQuery
		if err = c.ReadJSON(&req); err != nil {
			log.Println("read:", err)
			break
		}

		go h.s.RespondStream(ctx, req.Text, respCh, errCh)
	}

}
