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

type personLocation struct {
	ObjectType string `json:"docType"` //docType is used to distinguish the various types of objects in state database
	PersonLocationID       string `json:"personLocationID"`    //the fieldtags are needed to keep case from bouncing around
	PersonLocationState      string `json:"personLocationState"`
	Latitude       float64    `json:"latitude"`
        Longitude  float64 `json:"longitude"`
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
	if function == "createPersonLocation" { //create a new personLocation
		return t.createPersonLocation(stub, args)
	} else if function == "updateLatitudeLongitude" { //change longitude of a specific personLocation
		return t.updateLatitudeLongitude(stub, args)
	} else if function == "readPersonLocation" { //read a personLocation
		return t.readPersonLocation(stub, args)
	} else if function == "getNew" { //find personLocations for longitude X using rich query
		return t.getNew(stub, args)
	} else if function == "getHistoryForPersonLocation" { //get history of values for a personLocation
		return t.getHistoryForPersonLocation(stub, args)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// createPersonLocation - create a new personLocation, store into chaincode state
// ============================================================
func (t *SimpleChaincode) createPersonLocation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	// ==== Input sanitation ====
	fmt.Println("- start init personLocation")
	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	pkPersonLocationID := args[0]
	personLocationState := "new"
	latitude := 0.0
	longitude := 0.0

	// ==== Check if personLocation already exists ====
	personLocationAsBytes, err := stub.GetState(pkPersonLocationID)
	if err != nil {
		return shim.Error("Failed to get personLocation: " + err.Error())
	} else if personLocationAsBytes != nil {
		fmt.Println("This personLocation already exists: " + pkPersonLocationID)
		return shim.Error("This personLocation already exists: " + pkPersonLocationID)
	}

	// ==== Create personLocation object and marshal to JSON ====
	objectType := "personLocation"
	personLocation := &personLocation{objectType, pkPersonLocationID, personLocationState, latitude, longitude}
	personLocationJSONasBytes, err := json.Marshal(personLocation)
	if err != nil {
		return shim.Error(err.Error())
	}
	fmt.Println("- personLocation personLocationID" + pkPersonLocationID)
	// === Save personLocation to state ===
	err = stub.PutState(pkPersonLocationID, personLocationJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	indexName := "personLocationState~personLocationID"
	personLocationStateNameIndexKey, err := stub.CreateCompositeKey(indexName, []string{personLocation.PersonLocationState, personLocation.PersonLocationID})
	if err != nil {
		return shim.Error(err.Error())
	}
	//  Save index entry to state. Only the key personLocationID is needed, no need to store a duplicate copy of the personLocation.
	//  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
	value := []byte{0x00}
	stub.PutState(personLocationStateNameIndexKey, value)

	// ==== PersonLocation saved and indexed. Return success ====
	fmt.Println("- end init personLocation")
	return shim.Success(nil)
}

func (t *SimpleChaincode) getNew(stub shim.ChaincodeStubInterface, args []string) pb.Response {

        if len(args) > 0 {
                return shim.Error("Incorrect number of arguments. Expecting 0")
        }

        fmt.Println("- start getNew ")

        // Query the color~name index by color
        // This will execute a key range query on all keys starting with 'color'
	indexName := "personLocationState~personLocationID"
        resultsIterator, err := stub.GetStateByPartialCompositeKey(indexName, []string{"new"})
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	buffer, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Printf("- getPersonLocationsByRange queryResult:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) (*bytes.Buffer, error) {
        // buffer is a JSON array containing QueryResults
        var buffer bytes.Buffer
        buffer.WriteString("[")

        bArrayMemberAlreadyWritten := false
        for resultsIterator.HasNext() {
                queryResponse, err := resultsIterator.Next()
                if err != nil {
                        return nil, err
                }
                // Add a comma before array members, suppress it for the first array member
                if bArrayMemberAlreadyWritten == true {
                        buffer.WriteString(",")
                }
                buffer.WriteString("{\"Key\":")
                buffer.WriteString("\"")
                buffer.WriteString(queryResponse.Key)
                buffer.WriteString("\"")

                buffer.WriteString(", \"Record\":")
                // Record is a JSON object, so we write as-is
                buffer.WriteString(string(queryResponse.Value))
                buffer.WriteString("}")
                bArrayMemberAlreadyWritten = true
        }
        buffer.WriteString("]")

        return &buffer, nil
}

// ===============================================
// readPersonLocation - read a personLocation from chaincode state
// ===============================================
func (t *SimpleChaincode) readPersonLocation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var personLocationID, jsonResp string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting personLocationID of the personLocation to query")
	}

	personLocationID = args[0]
	valAsbytes, err := stub.GetState(personLocationID) //get the personLocation from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + personLocationID + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"PersonLocation does not exist: " + personLocationID + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

// ===========================================================
// transfer a personLocation by setting a new longitude personLocationID on the personLocation
// ===========================================================
func (t *SimpleChaincode) updateLatitudeLongitude(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//   0       1
	// "personLocationID", "bob"
	if len(args) < 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

        // ==== Input sanitation ====
        fmt.Println("- start init personLocation")
        if len(args[0]) <= 0 {
                return shim.Error("1st argument must be a non-empty string")
        }
        if len(args[1]) <= 0 {
                return shim.Error("2nd argument must be a non-empty string")
        }
        if len(args[2]) <= 0 {
                return shim.Error("3rd argument must be a non-empty string")
        }

	pkPersonLocationID := args[0]
        latitude, err := strconv.ParseFloat(args[1], 32)
        if err != nil {
                return shim.Error("3rd argument must be a numeric string")
        }
        longitude, err := strconv.ParseFloat(args[2], 32)
        if err != nil {
                return shim.Error("3rd argument must be a numeric string")
        }

	fmt.Println("- start transferPersonLocation ", pkPersonLocationID, latitude, longitude)

	personLocationAsBytes, err := stub.GetState(pkPersonLocationID)
	if err != nil {
		return shim.Error("Failed to get personLocation:" + err.Error())
	} else if personLocationAsBytes == nil {
		return shim.Error("PersonLocation does not exist")
	}

	personLocationToTransfer := personLocation{}
	err = json.Unmarshal(personLocationAsBytes, &personLocationToTransfer) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	personLocationToTransfer.Latitude = latitude //change the longitude
	personLocationToTransfer.Longitude = longitude //change the longitude
	personLocationToTransfer.PersonLocationState = "updated" //change the longitude

	personLocationJSONasBytes, _ := json.Marshal(personLocationToTransfer)
	err = stub.PutState(pkPersonLocationID, personLocationJSONasBytes) //rewrite the personLocation
	if err != nil {
		return shim.Error(err.Error())
	}

        // maintain the index
        indexName := "personLocationState~personLocationID"
        personLocationStateNameIndexKey, err := stub.CreateCompositeKey(indexName, []string{"new", pkPersonLocationID })
        if err != nil {
                return shim.Error("IS THIS REALLY AN ERROR?" + err.Error())
        }

        //  Delete index entry to state.
        err = stub.DelState(personLocationStateNameIndexKey)
        if err != nil {
                return shim.Error("IS THIS REALLY AN ERROR?" + "Failed to delete state:" + err.Error())
        }

	fmt.Println("- end transferPersonLocation (success)")
	return shim.Success(nil)
}



func (t *SimpleChaincode) getHistoryForPersonLocation(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	pkPersonLocationID := args[0]

	fmt.Printf("- start getHistoryForPersonLocation: %s\n", pkPersonLocationID)

	resultsIterator, err := stub.GetHistoryForKey(pkPersonLocationID)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the personLocation
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
		//as-is (as the Value itself a JSON personLocation)
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

	fmt.Printf("- getHistoryForPersonLocation returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
