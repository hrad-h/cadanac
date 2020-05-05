import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';

'use strict';

const ReadPersonLocation = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virusType: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.get('/api/cadanacv1/actors/' + profileState.context + '/location/' + dataSend.pkPersonLocationID);
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
        Retrieve latest HostLocation record for a Patient
      </Button>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div>
            <fieldset>
              <label for="pkPersonLocationID">pkPersonLocationID:</label><input type="text" id="pkPersonLocationID" name="pkPersonLocationID" value={dataSend.pkPersonLocationID} onChange={onChange}></input>
            </fieldset>
            <div className='button-center'> <br />
              <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
                Read Existing PersonLocation
            </Button>
            </div>
          </div>
        }
        {!(dataReceive === 'init') &&
          (((dataReceive === 'loading') &&
            <div>Loading...</div>
          ) ||
            (!(dataReceive === 'loading') &&
              <div> <JsonToTable json={JSON.parse(dataReceive)} /> </div>
            ))
        }
      </Modal>
    </div>
  )
}
export default ReadPersonLocation;
