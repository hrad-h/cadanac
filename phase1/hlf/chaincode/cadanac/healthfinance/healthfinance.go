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

type healthFinance struct {
	ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	HealthFinanceID       string `json:"healthFinanceID"`    //the fieldtags are needed to keep case from bouncing around
	VirusType      string `json:"virusType"`
	RemediationID       string    `json:"remediationID"`
        BalanceRemaining  float64 `json:"balanceRemaining"`
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
	if function == "createHealthFinance" { //create a new healthFinance
		return t.createHealthFinance(stub, args)
	} else if function == "updateRemediationIDBalanceRemaining" { //change balanceRemaining of a specific healthFinance
		return t.updateRemediationIDBalanceRemaining(stub, args)
	} else if function == "readHealthFinance" { //read a healthFinance
		return t.readHealthFinance(stub, args)
	} else if function == "getHistoryForHealthFinance" { //get history of values for a healthFinance
		return t.getHistoryForHealthFinance(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation" + function)
}

// ============================================================
// createHealthFinance - create a new healthFinance, store into chaincode state
// ============================================================
func (t *SimpleChaincode) createHealthFinance(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0       1       2     3
	// "asdf", "blue", "35", "bob"
        if len(args) < 4 {
                return shim.Error("Incorrect number of arguments. Expecting 3")
        }

        // ==== Input sanitation ====
        fmt.Println("- start init healthFinance")
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

        pkHealthFinanceID := args[0]
        remediationID := args[1]
        balanceRemaining , err := strconv.ParseFloat(args[2], 32)
        if err != nil {
                return shim.Error("3rd argument must be a numeric string")
        }
        virusType := args[3]


	// ==== Check if healthFinance already exists ====
	healthFinanceAsBytes, err := stub.GetState(pkHealthFinanceID)
	if err != nil {
		return shim.Error("Failed to get healthFinance: " + err.Error())
	} else if healthFinanceAsBytes != nil {
		fmt.Println("This healthFinance already exists: " + pkHealthFinanceID)
		return shim.Error("This healthFinance already exists: " + pkHealthFinanceID)
	}

	// ==== Create healthFinance object and marshal to JSON ====
	objectType := "healthFinance"
	healthFinance := &healthFinance{objectType, pkHealthFinanceID, virusType, remediationID, balanceRemaining}
	healthFinanceJSONasBytes, err := json.Marshal(healthFinance)
	if err != nil {
		return shim.Error(err.Error())
	}
	err = stub.PutState(pkHealthFinanceID, healthFinanceJSONasBytes)
        if err != nil {
                return shim.Error(err.Error())
        }

	// ==== HealthFinance saved and indexed. Return success ====
	fmt.Println("- end init healthFinance")
	return shim.Success(nil)
}

// ===============================================
// readHealthFinance - read a healthFinance from chaincode state
// ===============================================
func (t *SimpleChaincode) readHealthFinance(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var healthFinanceID, jsonResp string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting healthFinanceID of the healthFinance to query")
	}

	healthFinanceID = args[0]
	valAsbytes, err := stub.GetState(healthFinanceID) //get the healthFinance from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + healthFinanceID + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"HealthFinance does not exist: " + healthFinanceID + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

// ===========================================================
// transfer a healthFinance by setting a new balanceRemaining healthFinanceID on the healthFinance
// ===========================================================
func (t *SimpleChaincode) updateRemediationIDBalanceRemaining(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//   0       1
	// "healthFinanceID", "bob"
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting at least 2")
	}

        // ==== Input sanitation ====
        fmt.Println("- start init healthFinance")
        if len(args[0]) <= 0 {
                return shim.Error("1st argument must be a non-empty string")
        }
        if len(args[2]) <= 0 {
                return shim.Error("3rd argument must be a non-empty string")
        }

	pkHealthFinanceID := args[0]
        remediationID := args[1]
        balanceRemaining , err := strconv.ParseFloat(args[2], 32)
        if err != nil {
                return shim.Error("3rd argument must be a numeric string")
        }
        virusType := args[3]

	fmt.Println("- start transferHealthFinance ", pkHealthFinanceID, remediationID, balanceRemaining)

	healthFinanceAsBytes, err := stub.GetState(pkHealthFinanceID)
	if err != nil {
		return shim.Error("Failed to get healthFinance:" + err.Error())
	} else if healthFinanceAsBytes == nil {
		return shim.Error("HealthFinance does not exist")
	}

	healthFinanceToTransfer := healthFinance{}
	err = json.Unmarshal(healthFinanceAsBytes, &healthFinanceToTransfer) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	healthFinanceToTransfer.RemediationID = remediationID //change the balanceRemaining
	healthFinanceToTransfer.BalanceRemaining = healthFinanceToTransfer.BalanceRemaining + balanceRemaining //change the balanceRemaining
	healthFinanceToTransfer.VirusType = virusType //change the balanceRemaining

	healthFinanceJSONasBytes, _ := json.Marshal(healthFinanceToTransfer)
	err = stub.PutState(pkHealthFinanceID, healthFinanceJSONasBytes) //rewrite the healthFinance
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end transferHealthFinance (success)")
	return shim.Success(nil)
}

func (t *SimpleChaincode) getHistoryForHealthFinance(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	pkHealthFinanceID := args[0]

	fmt.Printf("- start getHistoryForHealthFinance: %s\n", pkHealthFinanceID)

	resultsIterator, err := stub.GetHistoryForKey(pkHealthFinanceID)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the healthFinance
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
		//as-is (as the Value itself a JSON healthFinance)
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

	fmt.Printf("- getHistoryForHealthFinance returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
