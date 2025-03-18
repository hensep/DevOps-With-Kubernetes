## Exercise 3.04: Project v1.4.1
Improve the deployment so that each branch creates a separate environment. The main branch should still be deployed in the default namespace.

```
name: Deploy Project to GKE

on:
  workflow_dispatch:
  push:
    paths:
      - 'Part 3/3.03/**'
      - '.github/workflows/deploy_project_gke.yaml'

env:
  PROJECT_ID: ${{ secrets.GKE_PROJECT }}
  GKE_CLUSTER: dwk-cluster
  GKE_ZONE: europe-north1-b
  IMAGE: gke-project
  BRANCH: ${{ github.ref_name }}

jobs:
  build-publish-deploy:
    name: Build, Publish and Deploy
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - uses: google-github-actions/auth@v2
      with:
        credentials_json: '${{ secrets.GKE_SA_KEY }}'

    - name: 'Set up Cloud SDK'
      uses: google-github-actions/setup-gcloud@v2

    - name: 'Use gcloud CLI'
      run: gcloud info

    - run: gcloud --quiet auth configure-docker

    - name: 'Get GKE credentials'
      uses: 'google-github-actions/get-gke-credentials@v2'
      with:
        cluster_name: '${{ env.GKE_CLUSTER }}'
        project_id: '${{ env.PROJECT_ID }}'
        location: '${{ env.GKE_ZONE }}'

    - name: Build
      run: |-
        docker build -t "gcr.io/$PROJECT_ID/$IMAGE-todo-app:${GITHUB_REF#refs/heads/}-$GITHUB_SHA" ./Part\ 3/3.03/todo-app
        docker build -t "gcr.io/$PROJECT_ID/$IMAGE-todo-backend:${GITHUB_REF#refs/heads/}-$GITHUB_SHA" ./Part\ 3/3.03/todo-backend
        docker build -t "gcr.io/$PROJECT_ID/$IMAGE-cronjob:${GITHUB_REF#refs/heads/}-$GITHUB_SHA" ./Part\ 3/3.03/cronjob

    - name: Publish
      run: |-
        docker push "gcr.io/$PROJECT_ID/$IMAGE-todo-app:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
        docker push "gcr.io/$PROJECT_ID/$IMAGE-todo-backend:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"
        docker push "gcr.io/$PROJECT_ID/$IMAGE-cronjob:${GITHUB_REF#refs/heads/}-$GITHUB_SHA"

    - name: Set up Kustomize
      uses: imranismail/setup-kustomize@v2.1.0

    - name: Deploy
      run: |-
        cd Part\ 3/3.03

        if [ "$BRANCH" == "main" ]; then
          NAMESPACE="default"
        else
          NAMESPACE="${BRANCH}"
        fi

        if [ "$NAMESPACE" != "default" ]; then
          kubectl create namespace $NAMESPACE || true
        fi

        kubectl config set-context --current --namespace=$NAMESPACE
        kustomize edit set namespace $NAMESPACE
        kustomize edit set image todo-app=gcr.io/$PROJECT_ID/$IMAGE-todo-app:${GITHUB_REF#refs/heads/}-$GITHUB_SHA
        kustomize edit set image todo-backend=gcr.io/$PROJECT_ID/$IMAGE-todo-backend:${GITHUB_REF#refs/heads/}-$GITHUB_SHA

        kustomize build . | kubectl apply -f -

        kubectl rollout status deployment todo-app-dep
        kubectl rollout status deployment todo-backend-dep

        kubectl get services -o wide
```
```
Context "gke_***_europe-north1-b_dwk-cluster" modified.
secret/postgres-credentials created
service/postgres-svc created
service/todo-app-svc created
service/todo-backend-svc created
deployment.apps/todo-app-dep created
deployment.apps/todo-backend-dep created
statefulset.apps/postgres created
cronjob.batch/wikipedia-todo-cronjob created
ingress.networking.k8s.io/todo-ingress created
Waiting for deployment "todo-app-dep" rollout to finish: 0 of 1 updated replicas are available...
deployment "todo-app-dep" successfully rolled out
deployment "todo-backend-dep" successfully rolled out
NAME               TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE   SELECTOR
kubernetes         ClusterIP   34.118.224.1     <none>        443/TCP    10d   <none>
postgres-svc       ClusterIP   None             <none>        5432/TCP   7s    app=postgres
todo-app-svc       ClusterIP   34.118.226.124   <none>        80/TCP     6s    app=todo-app
todo-backend-svc   ClusterIP   34.118.239.147   <none>        80/TCP     6s    app=todo-backend
```