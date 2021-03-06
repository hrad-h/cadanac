import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';
import VirusTypeSelect from './VirusTypeSelect';

'use strict';

const HistoryPersonHealth = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virusType: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.get('/api/cadanacv1/actors/' + profileState.context + '/patient/history/' + dataSend.pkPersonHealthID + '/' + dataSend.virusType);
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
        Retrieve all HostHealth records for a Patient with specific Virus
      </Button>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div>
            <fieldset>
              <label for="pkPersonHealthID">pkPersonHealthID:</label><input type="text" id="pkPersonHealthID" name="pkPersonHealthID" value={dataSend.pkPersonHealthID} onChange={onChange}></input>
              <label for="virusType">virusType:</label><VirusTypeSelect id="virusType" value={dataSend.virusType} onChange={onChange} />
            </fieldset>
            <div className='button-center'> <br />
              <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
                History Existing PersonHealth
            </Button>
            </div>
          </div>
        }
        {!(dataReceive === 'init') &&
          (((dataReceive === 'loading') &&
            <div>Loading...</div>
          ) ||
            (!(dataReceive === 'loading') &&
              <div>{
                (JSON.parse(dataReceive)).slice(0).reverse().map((row) => {
                  return <div><br />{row.Timestamp} <JsonToTable json={row.Value} /></div>
                })
              }</div>
            ))
        }
      </Modal>
    </div>
  )
}
export default HistoryPersonHealth;
