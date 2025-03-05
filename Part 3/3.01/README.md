# Exercise 3.01: Pingpong GKE
Deploy Ping-pong application into GKE.

In this exercise use a LoadBalancer service to expose the service.

If your Postgres logs say

initdb: error: directory "/var/lib/postgresql/data" exists but is not empty
It contains a lost+found directory, perhaps due to it being a mount point.
Using a mount point directly as the data directory is not recommended.
Create a subdirectory under the mount point.
you can add subPath configuration:

statefulset.yaml

```
# ...
volumeMounts:
- name: data
  mountPath: /var/lib/postgresql/data
  subPath: postgres
# ...
```
This will create a Postgres directory where the data will reside. subPaths also make it possible to use single volume for multiple purposes.
## Solution
```
$kubectl apply -f manifests/
deployment.apps/ping-pong-app-dep created
service/ping-pong-svc created
service/postgres-svc created
statefulset.apps/postgres created
```
```
$ curl http://34.88.150.180/pingpong
pong 1  
$ curl http://34.88.150.180/pingpong
pong 2
$ curl http://34.88.150.180/count
{"count":"2"}
```