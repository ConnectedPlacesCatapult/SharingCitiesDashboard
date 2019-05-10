#!/bin/sh

POD=$(kubectl get pod -n fcc-test -l component=fcc-api -o custom-columns=:metadata.name)
# kubectl exec $POD -c fcc-api -n fcc-test -it -- bash
kubectl exec $POD -c fcc-api -n fcc-test -it -- python3 db_setup.py
kubectl exec $POD -c fcc-api -n fcc-test -it -- python3 manage.py add_superuser
