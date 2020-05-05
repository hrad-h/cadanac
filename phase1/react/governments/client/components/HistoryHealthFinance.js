import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';

'use strict';

const HistoryHealthFinance = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virusType: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.get('/api/cadanacv1/actors/' + profileState.context + '/finance/history/' + dataSend.pkHealthFinanceID);
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
        Retrieve all HealthFinance records for a specific account
      </Button>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div>
            <fieldset>
              <label for="pkHealthFinanceID">pkHealthFinanceID:</label><input type="text" id="pkHealthFinanceID" name="pkHealthFinanceID" value={dataSend.pkHealthFinanceID} onChange={onChange}></input>
            </fieldset>
            <div className='button-center'> <br />
              <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
                HistoryHealthFinance Existing
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
export default HistoryHealthFinance;
