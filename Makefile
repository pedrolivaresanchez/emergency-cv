# Load environment variables from .env file
include .env

# Define variables
CURRENT_HASH := $(shell git rev-parse HEAD)
KUBECONFIG_FILE := ./.kubeconfig

deploy-webapp:
	@echo "Deploying Webapp ..."
	kubectl delete job emergency-cv--webapp--build--job --namespace production --kubeconfig $(KUBECONFIG_FILE) || true
	cat ./kubernetes.yml | sed 's/VAR_GITHUB_COMMIT_HASH/$(CURRENT_HASH)/g' | sed 's/VAR_GITHUB_TOKEN/$(GITHUB_TOKEN)/g' | kubectl apply -f - --kubeconfig $(KUBECONFIG_FILE)
	@echo "Build queued."
