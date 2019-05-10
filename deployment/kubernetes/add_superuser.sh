#!/bin/sh

POD=$(kubectl get pod -l component=fcc-api -o custom-columns=:metadata.name)
# kubectl exec $POD -c fcc-api -it -- bash
kubectl exec $POD -c fcc-api -it -- python3 db_setup.py
kubectl exec $POD -c fcc-api -it -- python3 manage.py add_superuser
