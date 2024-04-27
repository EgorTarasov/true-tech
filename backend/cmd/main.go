package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/EgorTarasov/true-tech/backend/internal"
	_ "github.com/EgorTarasov/true-tech/backend/internal/docs"
)

// @title True tech api
// @version 1.0
// @description This is a sample swagger for Fiber
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name BSD 3-Clause License
// @license.url https://raw.githubusercontent.com/EgorTarasov/true-tech/main/LICENSE
// @host api.larek.tech:9999
// @BasePath /
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	go func() {
		if err := internal.Run(ctx, &wg); err != nil {
			log.Fatal(err)
		}
		os.Exit(0)
	}()

	waitForExitSignal(cancel, &wg)
}

func waitForExitSignal(cancel context.CancelFunc, wg *sync.WaitGroup) {
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	fmt.Println("SIGINT signal")
	<-sigCh
	fmt.Println("\nWaiting tasks for shutdown")
	wg.Wait()
	fmt.Println("\nAll tasks finished")
	cancel()

}
