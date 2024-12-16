import React, { useEffect, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import Spinner from 'react-bootstrap/Spinner';
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'react-bootstrap'
import Card from '../../../components/Card'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DrawIcon from '@mui/icons-material/Draw';
import TextField from '@mui/material/TextField';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import LeadForm from './lead-form';
import IconButton from '@mui/material/IconButton';
import BackupIcon from '@mui/icons-material/Backup';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { FormControl, MenuItem, Select } from '@mui/material';
import axiosInstance from '../../../js/api';
import Swal from 'sweetalert2';
import axios from 'axios';

const LeadList = () => {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingLead(null);
  };
  const [selectedFilter, setSelectedFilter] = useState('All data');
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [editingLead, setEditingLead] = useState(null);

  const handleEdit = (lead) => {
    setEditingLead(lead);
    handleOpen();
  };


  const filteredLeads = leads.filter((lead) =>
    (selectedFilter === 'All data' || lead.leadType.toLowerCase() === selectedFilter.toLowerCase()) &&
    (lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.leadType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.reference.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  const handleDateRangeButtonClick = () => {
    setShowDateRangePicker(!showDateRangePicker);
  };

  const isSmallScreen = useMediaQuery('(max-width: 576px)');

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    p: 3,
    ...(isSmallScreen && { width: '350px' }),
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/lead/get-lead');
        console.log(response.data.data)
        setLeads(response.data.data);
      } catch (error) {
        console.error('Error fetching lead data:', error);
        toast.error('Error fetching lead data');
      }
    };

    fetchData();
  }, []);


  const handleRemove = async (lead) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Lead!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.post(`/lead/remove-lead?id=${lead._id}`);
          setLeads((prevLeads) => prevLeads.filter((l) => l._id !== lead._id));
          toast.success('Lead removed successfully');
        } catch (error) {
          console.error('Error removing Lead:', error);
          toast.error('Error removing Lead');
        }
      }
    });
  };

  const displayLeads = filteredLeads.map((lead, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{lead.fullName}</td>
      <td>{lead.service}</td>
      <td>{lead.leadType}</td>
      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
      <td>{lead.phoneNumber}</td>
      <td>{lead.reference}</td>
      <td>
        <div className="flex align-items-center list-user-action">
          <Link
            className="btn btn-sm btn-icon btn-success"
            to={`/dashboard/lead-update?lead_id=${lead._id}`}
          >
            <span className="btn-inner">
              <DrawIcon style={{ width: '32px', marginTop: '7px' }} />
            </span>
          </Link>
          <button
            style={{ marginLeft: '10px' }}
            className="btn btn-sm btn-icon btn-danger"
            onClick={() => handleRemove(lead)}
          >
            <span className="btn-inner">
              <svg
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
              >
                <path
                  d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M20.708 6.23975H3.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </td>
    </tr>
  ));


  const handleDownloadExcel = async () => {
    try {
      const response = await fetch('./gcs_data.xlsx');
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      link.download = 'leads_data.xlsx';

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };


  const handleUploadExcel = () => {
    document.getElementById('excelUploadInput').click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/lead/upload-lead', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success('File uploaded successfully');
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        toast.error('Error uploading file');
        console.error('Error uploading file:', error.response ? error.response.data : error);
      }
    } else {
      toast.error('Invalid file type. Please upload a .xlsx file.');
      console.error('Invalid file type. Please upload a .xlsx file.');
    }
  };


  return (
    <>
      <div className='margintop'>
        <Row>
          <Col sm="12">
            <Card>
              <div className="header-title d-block d-md-none">
                <h4 className="card-title">Lead Details </h4>
              </div>
              <Card.Header>
                <div className="header-title d-none d-md-block">
                  <h4 className="card-title">Lead Details </h4>
                </div>
                <div className="d-md-flex justify-content-between">
                  <div className="header-title">
                    <Button
                      onClick={handleOpen}
                      className="btn btn-btn btn-primary px-3 mb-lg-0 mb-2 mr-10 " style={{ fontWeight: '600' }}
                    >
                      <AddToPhotosIcon /> Add
                    </Button>
                    <Button
                      onClick={handleDownloadExcel}
                      className="btn btn-btn btn-info mb-lg-0 mb-2 px-3 mr-10" style={{ fontWeight: '600' }}
                    >
                      <CloudDownloadIcon />  Download Excel
                    </Button>
                    {/* "Upload Excel" button */}
                    <input
                      type="file"
                      id="excelUploadInput"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    <Button
                      onClick={handleUploadExcel}
                      className="btn btn-success px-3 mb-lg-0 mb-2"
                      style={{ fontWeight: '600' }}
                    >
                      <BackupIcon /> Upload Excel
                    </Button>
                    {/* "Upload Excel" button */}
                  </div>
                  <div className='d-flex justify-content-between d-block d-md-none'>
                    <Button
                      onClick={handleOpen}
                      className="btn btn-btn btn-primary px-3" style={{ fontWeight: '600' }}
                    >
                      <AddToPhotosIcon /> Add
                    </Button>
                    <FormControl variant="outlined" size="small" className='d-block d-md-none'>
                      <Select
                        id="simple-select-outlined"
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        style={{ width: '170px' }}
                      >
                        <MenuItem value="All data">All data</MenuItem>
                        <MenuItem value="Not Interested" style={{ color: 'red' }}>Not Interested</MenuItem>
                        <MenuItem value="Potential" style={{ color: 'yellowgreen' }}>Potential</MenuItem>
                        <MenuItem value="Interested" style={{ color: 'green' }}>Interested</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="px-0" style={{ position: 'relative' }}>
                <div className='card-body pt-0'>
                  <div className="d-flex justify-content-between">
                    <div className="header-title">
                      <TextField
                        placeholder="Search"
                        id="outlined-size-small"
                        size="small"
                        className='search-filed'
                        style={{ marginRight: '10px', width: '300px' }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="header-title">
                      <Button className="btn btn-btn btn-primary ml-60 ml-md-0" onClick={handleDateRangeButtonClick} style={{ padding: '5px' }}>
                        <DateRangeIcon style={{ color: '#fff' }} />
                      </Button>
                      {showDateRangePicker && (
                        <div className='date-filter'
                          style={{
                            position: 'absolute',
                            left: '70%',
                            zIndex: '999',
                            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
                          }}
                        >
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                          />
                        </div>
                      )}
                      <FormControl variant="outlined" size="small" style={{ marginLeft: '10px', width: '150px' }}>
                        <Select
                          id="simple-select-outlined"
                          value={selectedFilter}
                          onChange={handleFilterChange}
                          className='d-none d-md-block'
                        >
                          <MenuItem value="All data">All data</MenuItem>
                          <MenuItem value="Not Interested" style={{ color: 'red' }}>Not Interested</MenuItem>
                          <MenuItem value="Potential" style={{ color: 'yellowgreen' }}>Potential</MenuItem>
                          <MenuItem value="Interested" style={{ color: 'green' }}>Interested</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table
                    id="user-list-table"
                    className="table table-striped"
                    role="grid"
                    data-toggle="data-table"
                  >
                    <thead>
                      <tr className="ligth">
                        <th><b>No.</b></th>
                        <th><b>Full Name</b></th>
                        <th><b>Service</b></th>
                        <th><b>Type</b></th>
                        <th><b>Date</b></th>
                        <th><b>Mobile</b></th>
                        <th><b>Reference</b></th>
                        <th min-width="100px"><b>Action</b></th>
                      </tr>
                    </thead>
                    <tbody>{displayLeads}</tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="d-flex justify-content-between">
              <h4 id="modal-modal-title" className='ml-2'>
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
              </h4>
              <IconButton onClick={handleClose} style={{ color: 'red', marginTop: '-10px' }}>
                <CancelPresentationIcon style={{ fontSize: '30px' }} />
              </IconButton>
            </div>
            <LeadForm handleClose={handleClose} editingLead={editingLead} />
          </Box>
        </Modal>
      </div>
      {/* Add ToastContainer at the end of your component */}
      <ToastContainer />
    </>
  )
}

export default LeadList
