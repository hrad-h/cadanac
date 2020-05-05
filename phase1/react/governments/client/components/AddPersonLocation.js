import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';

'use strict';

const AddPersonLocation = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virusType: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.post('/api/cadanacv1/actors/' + profileState.context + '/location/', {
          pkPersonLocationID: dataSend.pkPersonLocationID
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
        Request new HostLocation tracking for a new Patient
      </Button>
      <div>Governments may request Location Providers to track a specific number.</div>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div>
            <fieldset>
              <label for="pkPersonLocationID">pkPersonLocationID:</label><input type="text" id="pkPersonLocationID" name="pkPersonLocationID" value={dataSend.pkPersonLocationID} onChange={onChange}></input>
            </fieldset>
            <div className='button-center'> <br />
              <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
                Add PersonLocation Tracking Request
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
export default AddPersonLocation;
