import React, { useState, useEffect } from 'react';
import { JsonToTable } from "react-json-to-table";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import axios from 'axios';

'use strict';

const GetnewPersonLocation = props => {

  const [profileState, setProfileState] = useState(props);
  const [dataSend, setDataSend] = useState({ pkHealthFinanceID: '', pkPersonHealthID: '', pkPersonLocationID: '', personStatus: '', remediationID: '', financialAmount: '', virusType: '', latitude: '', longitude: '' });
  const [dataReceive, setDataReceive] = useState('init');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dataReceive === 'loading') {
      const callRest = async () => {
        const response = await axios.get('/api/cadanacv1/actors/' + profileState.context + '/location/new/');
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
        Get all new HostLocation requests
      </Button>
      <div>Location Providers frequently monitor the list of new cell phone numbers to track (for all new Patients).</div>
      <Modal isOpen={isOpen} onRequestClose={() => { setIsOpen(false); setDataReceive('init'); }} contentLabel="Modal" className="Modal">
        {(dataReceive === 'init') &&
          <div className='button-center'> <br />
            <Button bsStyle="success" bsSize="small" onClick={() => { setDataReceive('loading'); }} >
              Getnew PersonLocation
            </Button>
          </div>
        }
        {!(dataReceive === 'init') &&
          (((dataReceive === 'loading') &&
            <div>Loading...</div>
          ) ||
            (!(dataReceive === 'loading') &&
              <div>
                {
                  (JSON.parse(dataReceive)).map((row) => {
                    return <div><br /> <JsonToTable json={row.Record} /></div>
                  })
                }
              </div>
            ))
        }
      </Modal>
    </div>
  )
}
export default GetnewPersonLocation;
