# CADANAC - A System and Method for tracking Covid19 and multiple host infections using Google Cloud, Kubernetes and Hyperledger Fabric


**Maintainers:** [hrad-h](https://github.com/hrad-h/)

Cadanac uses Hyperledger Fabric as the Blockchain Application Platform to run Smart Contracts and store Ledger State.

## Here are the steps to create the Hyperledger Fabric Application Platform Archicture

Hyperledger Fabric Application Platform Archicture is the highest layer of the Cadanac Stack.

The next layer down is Kubernetes.

### Step 1: First install Hyperledger Fabric onto Master GCE server "instance-cadanac-1"


Ensure the prerequisites capabilities are present.

```sh
curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.4
cd fabric-samples && ls
git -v
docker-compose -v
docker –v

TODO...
```


### Step 3: Install Hyperledger Fabric onto Secondary GCE servers "instance-cadanac-2" and "instance-cadanac-3"




Join each Secondary GCE server to the Master.  Repeat the command below once for each Secondary GCE server.  (During Step 2 the following command 

```sh
kubeadm join 10.128.0.2:6443 --token 775e8p.4x5r7rgy1k1v35zp --discovery-token-ca-cert-hash sha256:e3fff8030cd3bc11e66f33f0bff74efbf3621dd422f3eae71ac01dc566a2e25d
```


### Step 3: Configure the Master GCE server "instance-cadanac-1" for Cadanac Development


```sh
export PATH=$PATH:~/Desktop/fabric-samples/bin/
```


## Summary

The Cadanac Hyperledger Fabric Application Platform Archicture consists of the following Docker Containers deployed to Kubernetes Pods:

- Hyperledger Peers
- Hyperledger Orderer
- Hyperledger CA
- Hyperledger CLI (for Development)
