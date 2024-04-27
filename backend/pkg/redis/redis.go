package redis

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/redis/go-redis/v9"
)

// Redis реализация кеша с Redis
type Redis[T any] struct {
	client *redis.Client
}

// New создает новый экземпляр Redis
func New[T any](cfg Config) *Redis[T] {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	return &Redis[T]{client: rdb}
}

// Set добавляет значение в кеш
func (cache *Redis[T]) Set(ctx context.Context, key string, value T) error {
	jsonString, err := json.Marshal(value)
	if err != nil {
		return err
	}

	err = cache.client.Set(ctx, key, jsonString, 0).Err()
	if err != nil {
		return err
	}
	return nil
}

// Get возвращает значение из кеша
func (cache *Redis[T]) Get(ctx context.Context, key string) (T, error) {
	var value T
	val, err := cache.client.Get(ctx, key).Result()
	if err != nil {
		return value, err
	}

	err = json.Unmarshal([]byte(val), &value)
	if err != nil {
		return value, err
	}

	return value, nil
}

// Delete удаляет значение из кеша
func (cache *Redis[T]) Delete(ctx context.Context, key string) error {
	err := cache.client.Del(ctx, key).Err()
	if err != nil {
		return err
	}
	return nil
}
