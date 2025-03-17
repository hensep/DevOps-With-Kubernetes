Setup automatic deployment for the project as well.

Hints:

If your pod uses a Persistent Volume Claim access mode ReadWriteOnce, you may need to consider the deployment strategy, since the default (RollingUpdate) may cause problems. Read more from the documentation. The other option is to use an access mode that allows many pods to mount the volume.
If you are using Ingres, remember that it expects a service to give a successful response in the path / even if the service is mapped to some other path!

```
Run cd Part\ 3/3.03
  cd Part\ 3/3.03
  kubectl create namespace $***GITHUB_REF#refs/heads/*** || true
  kubectl config set-context --current --namespace=$***GITHUB_REF#refs/heads/***
  kustomize edit set namespace $***GITHUB_REF#refs/heads/***
  kustomize edit set image todo-app=gcr.io/$PROJECT_ID/$IMAGE-frontend:$***GITHUB_REF#refs/heads/***-$GITHUB_SHA
  kustomize edit set image todo-backend=gcr.io/$PROJECT_ID/$IMAGE-backend:$***GITHUB_REF#refs/heads/***-$GITHUB_SHA
  kustomize build . | kubectl apply -f -
  kubectl rollout status deployment todo-app-dep
  kubectl rollout status deployment todo-backend-dep
  kubectl get services -o wide
  shell: /usr/bin/bash -e ***0***
  env:
    PROJECT_ID: ***
    GKE_CLUSTER: dwk-cluster
    GKE_ZONE: europe-north1-b
    IMAGE: gke-project
    BRANCH: main
    CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE: /home/runner/work/DevOps-With-Kubernetes/DevOps-With-Kubernetes/gha-creds-9bbc13db74b6ac73.json
    GOOGLE_APPLICATION_CREDENTIALS: /home/runner/work/DevOps-With-Kubernetes/DevOps-With-Kubernetes/gha-creds-9bbc13db74b6ac73.json
    GOOGLE_GHA_CREDS_PATH: /home/runner/work/DevOps-With-Kubernetes/DevOps-With-Kubernetes/gha-creds-9bbc13db74b6ac73.json
    CLOUDSDK_CORE_PROJECT: ***
    CLOUDSDK_PROJECT: ***
    GCLOUD_PROJECT: ***
    GCP_PROJECT: ***
    GOOGLE_CLOUD_PROJECT: ***
    CLOUDSDK_METRICS_ENVIRONMENT: github-actions-setup-gcloud
    CLOUDSDK_METRICS_ENVIRONMENT_VERSION: 2.1.2
    KUBECONFIG: /home/runner/work/DevOps-With-Kubernetes/DevOps-With-Kubernetes/gha-kubeconfig-06fb056513a23774
    KUBE_CONFIG_PATH: /home/runner/work/DevOps-With-Kubernetes/DevOps-With-Kubernetes/gha-kubeconfig-06fb056513a23774
Error from server (AlreadyExists): namespaces "main" already exists
Context "gke_***_europe-north1-b_dwk-cluster" modified.
secret/postgres-credentials created
service/postgres-svc unchanged
service/todo-app-svc unchanged
service/todo-backend-svc unchanged
deployment.apps/todo-app-dep unchanged
deployment.apps/todo-backend-dep unchanged
statefulset.apps/postgres configured
cronjob.batch/wikipedia-todo-cronjob unchanged
ingress.networking.k8s.io/todo-ingress unchanged
deployment "todo-app-dep" successfully rolled out
deployment "todo-backend-dep" successfully rolled out
NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE   SELECTOR
postgres-svc       ClusterIP   None             <none>        5432/TCP   23m   app=postgres
todo-app-svc       ClusterIP   34.118.231.9     <none>        80/TCP     23m   app=todo-app
todo-backend-svc   ClusterIP   34.118.235.225   <none>        80/TCP     23m   app=todo-backend
```