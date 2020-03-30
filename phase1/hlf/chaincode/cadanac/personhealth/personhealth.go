/*
 SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type personHealth struct {
	ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	PersonHealthID       string `json:"personHealthID"`    //the fieldtags are needed to keep case from bouncing around
	VirusType      string `json:"virusType"`
	RemediationID       string    `json:"remediationID"`
        PersonStatus  string `json:"personStatus"`
}

// ===================================================================================
// Main
// ===================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// Init initializes chaincode
// ===========================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations
// ========================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "createPersonHealth" { //create a new personHealth
		return t.createPersonHealth(stub, args)
	} else if function == "updateRemediationIDPersonStatus" { //change personStatus of a specific personHealth
		return t.updateRemediationIDPersonStatus(stub, args)
	} else if function == "readPersonHealth" { //read a personHealth
		return t.readPersonHealth(stub, args)
	} else if function == "getHistoryForPersonHealth" { //get history of values for a personHealth
		return t.getHistoryForPersonHealth(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation" + function)
}

// ============================================================
// createPersonHealth - create a new personHealth, store into chaincode state
// ============================================================
func (t *SimpleChaincode) createPersonHealth(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0       1       2     3
	// "asdf", "blue", "35", "bob"
        if len(args) < 4 {
                return shim.Error("Incorrect number of arguments. Expecting 3")
        }

        // ==== Input sanitation ====
        fmt.Println("- start init personHealth")
        if len(args[0]) <= 0 {
                return shim.Error("1st argument must be a non-empty string")
        }
        if len(args[1]) <= 0 {
                return shim.Error("2nd argument must be a non-empty string")
        }
        if len(args[2]) <= 0 {
                return shim.Error("3rd argument must be a non-empty string")
        }
        if len(args[3]) <= 0 {
                return shim.Error("3rd argument must be a non-empty string")
        }

        pkPersonHealthID := args[0]
        remediationID := args[1]
        personStatus := args[2]
        virusType := args[3]

	indexName := "virusType~personHealthID"
	virusTypeNameIndexKey, err := stub.CreateCompositeKey(indexName, []string{virusType, pkPersonHealthID})
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("- personHealth personHealthID" + pkPersonHealthID + virusTypeNameIndexKey)

	// ==== Check if personHealth already exists ====
	personHealthAsBytes, err := stub.GetState(virusTypeNameIndexKey)
	if err != nil {
		return shim.Error("Failed to get personHealth: " + err.Error())
	} else if personHealthAsBytes != nil {
		fmt.Println("This personHealth already exists: " + pkPersonHealthID)
		return shim.Error("This personHealth already exists: " + pkPersonHealthID)
	}

	// ==== Create personHealth object and marshal to JSON ====
	objectType := "personHealth"
	personHealth := &personHealth{objectType, pkPersonHealthID, virusType, remediationID, personStatus}
	personHealthJSONasBytes, err := json.Marshal(personHealth)
	if err != nil {
		return shim.Error(err.Error())
	}
	// === Save personHealth to state ===
	err = stub.PutState(virusTypeNameIndexKey, personHealthJSONasBytes)
        if err != nil {
                return shim.Error(err.Error())
        }

	// ==== PersonHealth saved and indexed. Return success ====
	fmt.Println("- end init personHealth")
	return shim.Success(nil)
}

// ===============================================
// readPersonHealth - read a personHealth from chaincode state
// ===============================================
func (t *SimpleChaincode) readPersonHealth(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var personHealthID, jsonResp string
	var err error

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting personHealthID of the personHealth to query")
	}

	personHealthID = args[0]
        virusType := args[1]
        indexName := "virusType~personHealthID"
        virusTypeNameIndexKey, err := stub.CreateCompositeKey(indexName, []string{virusType, personHealthID})
        if err != nil {
                return shim.Error(err.Error())
        }
        fmt.Println("- personHealth personHealthID" + personHealthID + virusTypeNameIndexKey)

        // ==== Check if personHealth already exists ====
        valAsbytes, err := stub.GetState(virusTypeNameIndexKey)
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + personHealthID + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"PersonHealth does not exist: " + personHealthID + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

// ===========================================================
// transfer a personHealth by setting a new personStatus personHealthID on the personHealth
// ===========================================================
func (t *SimpleChaincode) updateRemediationIDPersonStatus(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//   0       1
	// "personHealthID", "bob"
	if len(args) < 4 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

        // ==== Input sanitation ====
        fmt.Println("- start init personHealth")
        if len(args[0]) <= 0 {
                return shim.Error("1st argument must be a non-empty string")
        }
        if len(args[1]) <= 0 {
                return shim.Error("2nd argument must be a non-empty string")
        }
        if len(args[2]) <= 0 {
                return shim.Error("3rd argument must be a non-empty string")
        }
        if len(args[3]) <= 0 {
                return shim.Error("3rd argument must be a non-empty string")
        }

	pkPersonHealthID := args[0]
        remediationID := args[1]
        personStatus := args[2]
        virusType := args[3]

	fmt.Println("- start transferPersonHealth ", pkPersonHealthID, remediationID, personStatus)

	indexName := "virusType~personHealthID"
	virusTypeNameIndexKey, err := stub.CreateCompositeKey(indexName, []string{virusType, pkPersonHealthID})
	if err != nil {
		return shim.Error(err.Error())
	}
	personHealthAsBytes, err := stub.GetState(virusTypeNameIndexKey)
	if err != nil {
		return shim.Error("Failed to get personHealth:" + err.Error())
	} else if personHealthAsBytes == nil {
		return shim.Error("PersonHealth does not exist")
	}

	personHealthToTransfer := personHealth{}
	err = json.Unmarshal(personHealthAsBytes, &personHealthToTransfer) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	personHealthToTransfer.RemediationID = remediationID //change the personStatus
	personHealthToTransfer.PersonStatus = personStatus //change the personStatus
	personHealthToTransfer.VirusType = virusType //change the personStatus

	personHealthJSONasBytes, _ := json.Marshal(personHealthToTransfer)
	err = stub.PutState(virusTypeNameIndexKey, personHealthJSONasBytes) //rewrite the personHealth
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end transferPersonHealth (success)")
	return shim.Success(nil)
}

func (t *SimpleChaincode) getHistoryForPersonHealth(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	pkPersonHealthID := args[0]

	fmt.Printf("- start getHistoryForPersonHealth: %s\n", pkPersonHealthID)

        virusType := args[1]
        indexName := "virusType~personHealthID"
        virusTypeNameIndexKey, err := stub.CreateCompositeKey(indexName, []string{virusType, pkPersonHealthID})
        if err != nil {
                return shim.Error(err.Error())
        }
        fmt.Println("- personHealth personHealthID" + pkPersonHealthID + virusTypeNameIndexKey)

	resultsIterator, err := stub.GetHistoryForKey(virusTypeNameIndexKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the personHealth
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON personHealth)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForPersonHealth returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
