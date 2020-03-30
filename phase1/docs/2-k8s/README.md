# CADANAC - A System and Method for tracking Covid19 and multiple host infections using Google Cloud, Kubernetes and Hyperledger Fabric


**Maintainers:** [hrad-h](https://github.com/hrad-h/)

Cadanac uses Kubernetes for Docker Container Orchestration and Scaling.

## Here are the steps to create the Kubernetes Container Archicture

Container Architecture is the middle layer of the Cadanac Stack.

Beneath Kubernetes and Docker is the GCP Technology Architecture and the Hyperledger Fabric Application Platform Archicture is above.

### Step 1: First, before installing Kubernetes, update the "instance-cadanac-1" GCE server PAAS with minimum capabilites as required by Hyperledger Fabric

"instance-cadanac-1" is the master Kubernetes node.

sudo will be required.

```sh
TODO
```

### Step 2: Next install Kubernetes onto Master GCE server "instance-cadanac-1"


```sh
TODO
```

### Step 3: Install Kubernetes onto each Secondary GCE server "instance-cadanac-2" and "instance-cadanac-3"


```sh
TODO
```


### Step 4: Join each Secondary GCE server to the Master

Repeat the command below once for each Secondary GCE server.  (During Step 2 the following command was displayed by the Kubernetes installation - the IP address, token and hash will be different.)  Use the same command for each Secondary GCE server.

```sh
kubeadm join 10.128.0.2:6443 --token 775e8p.4x5r7rgy1k1v35zp --discovery-token-ca-cert-hash sha256:e3fff8030cd3bc11e66f33f0bff74efbf3621dd422f3eae71ac01dc566a2e25d
```


### Step 5: Confirm Kubernetes is operation from "instance-cadanac-1"

Likely you will not need to log into the Secondary GCE servers again; except for Disaster Recovery.

Here are some convenient commands to configure Kubernetes:

```sh
kubectl get nodes
source <(kubectl completion bash)
echo "source <(kubectl completion bash)" >> ~/.bashrc
### only need to do if we do NOT want the master node to have pods deployed
kubectl describe nodes | grep -i Taint
kubectl taint nodes --all node-role.kubernetes.io/master-
kubectl describe nodes | grep -i Taint
```


## Summary

The Cadanac Container Architecture consists of:

- Kubernetes
- Docker Containers

