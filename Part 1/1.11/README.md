# Exercise 1.11: Persisting data
Let's share data between "Ping-pong" and "Log output" applications using persistent volumes. Create both a PersistentVolume and PersistentVolumeClaim and alter the Deployment to utilize it. As PersistentVolumes are often maintained by cluster administrators rather than developers and those are not application specific you should keep the definition for those separated, perhaps in own folder.

Save the number of requests to "Ping-pong" application into a file in the volume and output it with the timestamp and hash when sending a request to our "Log output" application. In the end, the two pods should share a persistent volume between the two applications. So the browser should display the following when accessing the "Log output" application:
```
2020-03-30T12:15:17.705Z: 8523ecb1-c716-4cb6-a044-b9e83bb98e43.
Ping / Pongs: 3
```

## Solution
```
curl localhost:8081/pingpong
pong 6
curl localhost:8081/pingpong
pong 7
curl localhost:8081/pingpong
pong 8
curl localhost:8081/
2025-01-24T17:21:20.565Z: 25822f7a4087e7e4c8a4b48e204a3226f05c810f4d4216ddf98956d519428ccb
Ping / Pongs: 8
kubectl delete deployments.apps log-output-dep & kubectl delete deployments.apps ping-pong-dep & kubectl apply -f log-output-app/manifests/deployment.yaml & kubectl apply -f ping-pong-app/manifests/deployment.yaml
[1] 11120
[2] 11121
[3] 11122
deployment.apps "log-output-dep" deleted
deployment.apps "ping-pong-dep" deleted
deployment.apps/log-output-dep created
deployment.apps/ping-pong-dep created
[1]   Done                    kubectl delete deployments.apps log-output-dep
[2]-  Done                    kubectl delete deployments.apps ping-pong-dep
[3]+  Done                    kubectl apply -f log-output-app/manifests/deployment.yaml
curl localhost:8081/
2025-01-24T17:23:37.520Z: 3b1206c5698189d516c8ebafcef20a94170ef9696076fd2e5147ea4557e76fa2
Ping / Pongs: 8
```