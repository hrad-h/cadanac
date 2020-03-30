
KUBECONFIG_FOLDER=${PWD}/k8s

kubectl delete -f ${KUBECONFIG_FOLDER}/7-1-cli.yaml

kubectl delete -f ${KUBECONFIG_FOLDER}/6-2-chaincode_instantiate.yaml
kubectl delete -f ${KUBECONFIG_FOLDER}/6-1-chaincode_install.yaml

kubectl delete -f ${KUBECONFIG_FOLDER}/5-2-join_channel.yaml
kubectl delete -f ${KUBECONFIG_FOLDER}/5-1-create_channel.yaml

kubectl delete --ignore-not-found=true -f ${KUBECONFIG_FOLDER}/1-2-docker.yaml

kubectl delete -f ${KUBECONFIG_FOLDER}/4-2-peersDeployment.yaml
kubectl delete -f ${KUBECONFIG_FOLDER}/4-1-blockchain-services.yaml

kubectl delete -f ${KUBECONFIG_FOLDER}/3-2-generateArtifactsJob.yaml
kubectl delete -f ${KUBECONFIG_FOLDER}/3-1-copyArtifactsJob.yaml

kubectl delete -f ${KUBECONFIG_FOLDER}/2-1-createVolume.yaml
kubectl delete --ignore-not-found=true -f ${KUBECONFIG_FOLDER}/1-1-docker-volume.yaml

kubectl delete -f ${KUBECONFIG_FOLDER}/0-1-Namespace.yaml

#sleep 15

echo -e "\npv:" 
kubectl get pv
echo -e "\npvc:"
kubectl get pvc
echo -e "\njobs:"
kubectl get jobs 
echo -e "\ndeployments:"
kubectl get deployments
echo -e "\nservices:"
kubectl get services
echo -e "\npods:"
kubectl get pods
echo -e "\nnamespaces:"
kubectl get namespaces | grep cadanac

echo -e "\nNetwork Deleted!!\n"

