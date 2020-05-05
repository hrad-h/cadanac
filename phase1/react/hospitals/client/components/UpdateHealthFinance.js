import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';
import VirusTypeSelect from './VirusTypeSelect';

'use strict';

const UpdateHealthFinance = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virusType: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.put('/api/cadanacv1/actors/' + profileState.context + '/finance/', {
          pkHealthFinanceID: dataSend.pkHealthFinanceID,
          remediationID: dataSend.remediationID,
          financialAmount: dataSend.financialAmount,
          virusType: dataSend.virusType
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
        {profileState.msg1}
      </Button>
      <div>{profileState.msg2}</div>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div>
            <fieldset>
              <label for="pkHealthFinanceID">pkHealthFinanceID:</label><input type="text" id="pkHealthFinanceID" name="pkHealthFinanceID" value={dataSend.pkHealthFinanceID} onChange={onChange}></input>
              <label for="remediationID">remediationID:</label><input type="text" id="remediationID" name="remediationID" value={dataSend.remediationID} onChange={onChange}></input>
              <label for="financialAmount">financialAmount:</label><input type="text" id="financialAmount" name="financialAmount" value={dataSend.financialAmount} onChange={onChange}></input>
              <label for="virusType">virusType:</label><VirusTypeSelect id="virusType" value={dataSend.virusType} onChange={onChange} />
            </fieldset>
            <div className='button-center'> <br />
              <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
                UpdateHealthFinance Existing
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
export default UpdateHealthFinance;
