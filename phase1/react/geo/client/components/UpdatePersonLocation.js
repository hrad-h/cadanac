import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';

'use strict';

const UpdatePersonLocation = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virustype: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.put('/api/cadanacv1/actors/' + profileState.context + '/location/', {
          pkPersonLocationID: dataSend.pkPersonLocationID,
          latitude: dataSend.latitude,
          longitude: dataSend.longitude
        });
        setDataReceive(response.data);
      };
      callRest();
    }
  }, [dataReceive])

  const onChange = (e) => {
    setDataSend({ ...dataSend, [e.target.name]: e.target.value });
  }

  return (
    <div> <br />
      <Button bsStyle="success" bsSize="small" onClick={() => setIsOpen(true)}>
        <span className="glyphicon glyphicon-plus"></span>
        Update HostLocation with present Latitude & Longitude for a Patient
      </Button>
      <div>For newly added as well as existing Patients.  In the case of new Patients, remove their number from the new request list).</div>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div>
            <fieldset>
              <label for="pkPersonLocationID">pkPersonLocationID:</label><input type="text" id="pkPersonLocationID" name="pkPersonLocationID" value={dataSend.pkPersonLocationID} onChange={onChange}></input>
              <label for="latitude">latitude:</label><input type="text" id="latitude" name="latitude" value={dataSend.latitude} onChange={onChange}></input>
              <label for="longitude">longitude:</label><input type="text" id="longitude" name="longitude" value={dataSend.longitude} onChange={onChange}></input>
            </fieldset>
            <div className='button-center'> <br />
              <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
                Getnew PersonLocation
            </Button>
            </div>
          </div>
        }
        {!(dataReceive === 'init') &&
          (((dataReceive === 'loading') &&
            <div>Loading...</div>
          ) ||
            (!(dataReceive === 'loading') &&
              <div>{dataReceive}</div>
            ))
        }
      </Modal>
    </div>
  )
}
export default UpdatePersonLocation;
