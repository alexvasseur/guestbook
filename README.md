# guestbook
Redis guestbook PHP (from K8s examples but simplified)

Configuration and default values
```
$host = getenv('REDIS_HOST')?:"redis";
$port = getenv('REDIS_PORT')?:"6379";
$password = getenv('REDIS_PASSWORD');
```
(no AUTH by default)
so that it connects to a redis container in the same namespace by default.

# Building & Running

## Docker

```
docker build . -t guestbook
docker images
docker tag guestbook avasseur/guestbook
docker push avasseur/guestbook
```
https://hub.docker.com/repository/docker/avasseur/guestbook


## Docker running locally

```
docker run -it -p 8080:80 guestbook
docker run -it -p 8080:80 -e REDIS_HOST=host.docker.internal  -e REDIS_PASSWORD=foo
```

## Kubernetes OpenShift

On OpenShift you may need to run in your namespace:
```oc adm policy add-scc-to-user anyuid -z default```
as the base image for that container is running Apache HTTPd as root on port 80 which OpenShift SCC won't allow by default.

# Testing the app

```
redis-cli
config set requirepass "foo"
```
http://localhost:8080/

