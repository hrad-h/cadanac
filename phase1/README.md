# CADANAC - A System and Method for tracking Covid19 and multiple host infections using Google Cloud, Kubernetes and Hyperledger Fabric


**Maintainers:** [hrad-h](https://github.com/hrad-h/)

This is a prototype to research and create a simulation of a real-world project using the capabilities of Google Cloud, Kubernetes, Docker and Hyperledger Fabric.  This work attempts to go beyond a simple "HowTo Create Your First ..."

This project has taken tidbits of inspiration from many other authors, all of whom are gratefully acknowledged.  **We are all standing on the shoulders of Giants!**

This project was coded completely on the cloud using Unix commands and vi :-)


Cadanac is a SAAS Virus Case Management System including Financial and Location Tracking Capabilities.  It is developed in response to Covid19 and can accomodate dual and multiple infections (for example the Flu and Covid19 on the same host).


## Cadanac Value Chain and Capabilities

Cadanac delivers the following capabilities to 

### Virus Case Management ability for Hospitals and Health Care Providers  

- Creating and Updating infected Hosts records  

### Host Location Management ability for Location Providers (such as Cell Phone Companies)  

- Creating and Updating geographical positions of infected Hosts  

### Financial Allocation Management ability for Health Care Providers, NGOs and Governments  

#### Assigning Finances to different Health Care Providers for specific purposes  

- specific virues  

- specific remediation plans  

#### Health Care Providers track Expenditures accordingly  

### Overall System Monitoring, Governance and Intelligence/Trend Gathering by Governments  

#### Increases/Decreases in Host infections  

- per specific virus  

- per remediation plan  

#### Location Proximity of Host infections  

#### Remediation plans analysis  

- Efficacy vs Cost  


## Cadanac Core Principles

Cadanac should strive for:

- Scalability
- No Data Loss
- Security

## Risks and Mitigations

Some links that challenge the core principles
-	https://www.ibm.com/blogs/blockchain/2019/04/does-hyperledger-fabric-perform-at-scale/
-	https://blog.bybit.com/research-and-analysis/blockchain-performance-and-scalability-hyperledger-fabric/
-	https://thenextweb.com/podium/2019/05/05/ibms-hyperledger-isnt-a-real-blockchain-heres-why/

Mitigation involves applying rigorous system stress tests.


## Cadanac Architecture

All Workflows and Use Cases are here

[Cadanac Business, Data, Application Architecture - Hyperledger Fabric PAAS](docs/4-cadanac/README.md)

Google Cloud IAAS Definition

[Cadanac Technolgogy Architecture - GCP IAAS](docs/1-gcp/README.md)

Kubernetes IAAS Definition

[Cadanac Technolgogy Architecture - Kubernetes IAAS](docs/2-k8s/README.md)

Hyperledger Fabric Definition

[Cadanac Platform Architecture - Hyperledger Fabric PAAS](docs/3-hlf/README.md)


## Cadanac DevOps

CICD Pipelines are coming!

Until then:

### manually create all GCE & Kubernetes IAAS and Hyperledger Fabric PAAS

See the Cadanac Architecture documentation.

### ./cadanac_start.sh

This will automatically:

- create all Kubernetes components
- fetch all Docker containers
- create all Hyperledger Fabric channels, peers, orderer, cli
- install and instantiate all chaincode

### ./cadanac_stop.sh 

This will undo everything in cadanac_start.sh

## Future Directions

- with minature IoT tracking devices, Cadanac can be used to track viruses of other species
- Machine Learning capability for trending and forecasting


## References

* [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/release-1.3/)
* [Apache CouchDB](http://couchdb.apache.org/)
* [Apache Kafka](https://kafka.apache.org/)
* [blockchain-network-on-kubernetes](https://github.com/IBM/blockchain-network-on-kubernetes)

## SPDX-License-Identifier: Apache-2.0

This project has made significant changes to software obtained under Apache-2.0

- This information is provided "as is", with no assurance or guarantee of completeness, accuracy or timeliness of the information, and without warranty of any kind.