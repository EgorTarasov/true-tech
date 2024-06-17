VERSION := 0.0.1



.PHONY: docker-build-amd64
docker-build-amd64:
	docker build \
		--tag ghcr.io/egortarasov/lct-2024/ui:amd64-$(VERSION) \
		--platform linux/amd64 .

.PHONY: docker-build-arm64
docker-build-arm64:
	docker build \
		--tag ghcr.io/egortarasov/lct-2024/ui:arm64-$(VERSION) \
		--platform linux/arm64 .



.PHONY: docker-push-amd64
docker-push-amd64:
	docker push ghcr.io/egortarasov/lct-2024/ui:amd64-$(VERSION)

.PHONY: docker-push-arm64
docker-push-arm64:
	docker push ghcr.io/egortarasov/lct-2024/ui:arm64-$(VERSION)

.PHONY: docker-publish-amd64
docker-publish-amd64: docker-build-amd64 docker-push-amd64

.PHONY: docker-publish-arm64
docker-publish-arm64: docker-build-arm64 docker-push-arm64

.PHONY: docker-publish
docker-publish:	docker-publish-amd64 docker-publish-arm64

