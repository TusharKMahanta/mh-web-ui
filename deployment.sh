#!/bin/sh
ENV=$1
TAG=$2

SERVICE_NAME=mhwebui

echo $ENV
echo $TAG

kubectl config use-context minikube

helm install  $SERVICE_NAME ./deployment
