# Exercise 3.02: Back to Ingress
Deploy the "Log output" and "Ping-pong" applications into GKE and expose it with Ingress.

"Ping-pong" will have to respond from /pingpong path. This may require you to rewrite parts of the code.

Note that Ingress expects a service to give a successful response in the path / even if the service is mapped to some other path!

## Solution
```
$ kubectl get svc
NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
log-output-svc   ClusterIP   34.118.230.62    <none>        80/TCP     6m39s
ping-pong-svc    ClusterIP   34.118.230.132   <none>        80/TCP     57m
postgres-svc     ClusterIP   34.118.239.132   <none>        5432/TCP   57m

$ kubectl get deployments.apps
NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
log-output-app-dep   1/1     1            1           4m43s
ping-pong-app-dep    1/1     1            1           53m

$ kubectl get ing
NAME                  CLASS    HOSTS   ADDRESS         PORTS   AGE
application-ingress   <none>   *       34.160.245.69   80      20m

$ curl http://34.160.245.69/pingpong
pong 4

$ curl http://34.160.245.69/

    File content: this text is from file

    Env variable: MESSAGE=hello world
    2025-03-05T15:27:44.718Z: ee824cdf06b7caa401f42d51323ec3acdf8cb812a2f0c32953b21bd7483b2255
    Ping / Pongs: 4

$ curl http://34.160.245.69/count
{"count":"4"}
```