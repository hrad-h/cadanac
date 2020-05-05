import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';
import VirusTypeSelect from './VirusTypeSelect';
import PersonStatusSelect from './PersonStatusSelect';

'use strict';

const UpdatePersonHealth = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virusType: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.put('/api/cadanacv1/actors/' + profileState.context + '/patient/', {
          pkPersonHealthID: dataSend.pkPersonHealthID,
          remediationID: dataSend.remediationID,
          personStatus: dataSend.personStatus,
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
        Update a HostHealth record for an existing Patient
      </Button>
      <div>Patients status can change with regard to a specific virus; for example to Relapse, or a new Remediation treatment may be given.</div>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div>
            <fieldset>
              <label for="pkPersonHealthID">pkPersonHealthID:</label><input type="text" id="pkPersonHealthID" name="pkPersonHealthID" value={dataSend.pkPersonHealthID} onChange={onChange}></input>
              <label for="remediationID">remediationID:</label><input type="text" id="remediationID" name="remediationID" value={dataSend.remediationID} onChange={onChange}></input>
              <label for="personStatus">personStatus:</label><PersonStatusSelect id="personStatus" value={dataSend.personStatus} onChange={onChange} />
              <label for="virusType">virusType:</label><VirusTypeSelect id="virusType" value={dataSend.virusType} onChange={onChange} />
            </fieldset>
            <div className='button-center'> <br />
              <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
                Update PersonHealth
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
export default UpdatePersonHealth;
