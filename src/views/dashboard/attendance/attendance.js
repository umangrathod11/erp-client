import React, { useState, useEffect, Fragment } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Row, Col, Modal, Form } from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import TextField from '@mui/material/TextField'
import DateRangeIcon from '@mui/icons-material/DateRange'
import { DateRange } from 'react-date-range'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import axiosInstance from '../../../js/api'
import { ToastContainer, toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'

function Attendance() {
  const [manualAttendance, setManualAttendance] = useState([])
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
  }
  const [selectedUserAttendance, setSelectedUserAttendance] = useState(null)
  const [employeeData, setEmployeeData] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [userData, setUserData] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('All data')
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ])
  const [showDateRangePicker, setShowDateRangePicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value)
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setManualAttendance((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleDateRangeButtonClick = () => {
    setShowDateRangePicker(!showDateRangePicker)
  }

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage - 1)
  }

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10))
    setCurrentPage(0)
  }

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axiosInstance.get('/attendance/get-attendance')
        setAttendanceData(response.data.data)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
        toast.error('Error fetching attendance data')
      }
    }
    fetchAttendanceData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/user/get')
      setUserData(response.data.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Error fetching user data')
    }
  }

  const fetchEmployeeData = async () => {
    try {
      const response = await axiosInstance.get('/employee/get')
      setEmployeeData(response.data.data)
    } catch (error) {
      console.error('Error fetching employee data:', error)
      toast.error('Error fetching employee data')
    }
  }

  useEffect(() => {
    fetchUserData()
    fetchEmployeeData()
  }, [])

  const offset = currentPage * itemsPerPage

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    setCurrentPage(0)
  }

  const filterData = () => {
    let dataToFilter =
      selectedFilter.toLowerCase() === 'employee' ? employeeData : userData

    return dataToFilter.filter(
      (item) =>
        item.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const calculateAttendance = (userId) => {
    // Get today's date
    const today = new Date()

    // Get the year and month of today's date
    const year = today.getFullYear()
    const month = today.getMonth()

    // Get the first and last day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    // Generate an array of dates for the full month
    const fullMonthDates = getDatesBetween(firstDayOfMonth, lastDayOfMonth)

    // Filter attendance data for the specific user
    const userAttendances = attendanceData.filter(
      (attendance) => attendance.personID == userId,
    )

    // Get the dates for which the user has attendance records
    const userAttendanceDates = userAttendances.map(
      (attendance) => new Date(attendance.attendanceDate),
    )

    // Calculate the total number of days in the month
    const totalDays = fullMonthDates.length

    // Calculate the number of days the user was present
    const presentDays = userAttendanceDates.filter((date) =>
      fullMonthDates.includes(date.toISOString().split('T')[0]),
    ).length

    // Calculate the number of absent days
    const absentDays = totalDays - presentDays

    // Return an object with calculated values
    return { totalDays, presentDays, absentDays }
  }

  // Helper function to get dates between two dates
  const getDatesBetween = (startDate, endDate) => {
    const dates = []
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates.map((date) => date.toISOString().split('T')[0])
  }

  const handleViewAttendance = (userId) => {
    const { totalDays, presentDays, absentDays } = calculateAttendance(userId)
    setSelectedUserAttendance({
      userId,
      totalDays,
      presentDays,
      absentDays,
    })
  }

  const handleOpenModal = (userId) => {
    const today = new Date().toISOString().split('T')[0]

    const existingAttendance = attendanceData.find(
      (attendance) =>
        attendance.personID === userId &&
        attendance.attendanceType === 'Manual' &&
        attendance.attendanceDate === today,
    )

    if (existingAttendance) {
      toast.error('Manual attendance for today already recorded!')
    } else {
      setManualAttendance({
        ...manualAttendance,
        personID: userId,
        attendanceType: 'Manual',
      })
      setOpen(true)
    }
  }

  const handleAddManualAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      const existingAttendance = attendanceData.find(
        (attendance) =>
          attendance.personID == manualAttendance.personID &&
          attendance.attendanceType == 'Manual' &&
          attendance.attendanceDate == today,
      )

      if (existingAttendance) {
        toast.warning('Manual attendance for today already recorded!')
      } else {
        console.log(manualAttendance)
        await axiosInstance.post(
          '/attendance/add-manual-attendance',
          manualAttendance,
        )
        toast.success('Manual attendance added successfully!')

        const response = await axiosInstance.get('/attendance/get-attendance')
        setAttendanceData(response.data.data)

        handleClose()
      }
    } catch (error) {
      console.error('Error adding manual attendance:', error)
      toast.error('Error adding manual attendance')
    }
  }

  return (
    <>
      <div className="margintop">
        <Fragment>
          <Row>
            <Col sm="12">
              <Card>
                <Card.Header className="d-flex justify-content-between">
                  <div className="header-title">
                    <h3 className="card-title">Attendance</h3>
                  </div>
                  <div className="header-title">
                    <Link
                      className="btn btn-btn btn-primary px-2"
                      to="/dashboard/Attendance/scan"
                    >
                      <QrCodeScannerIcon style={{ marginRight: '6px' }} /> Scan
                      QR
                    </Link>
                  </div>
                </Card.Header>
                <Card.Body className="px-0" style={{ position: 'relative' }}>
                  <div className="card-body pt-0">
                    <div className="d-flex justify-content-between">
                      <div className="header-title" style={{ lineHeight: '0' }}>
                        <TextField
                          placeholder="Search"
                          id="outlined-size-small"
                          size="small"
                          className="search-filed"
                          style={{ marginRight: '10px', width: '300px' }}
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        
                      </div>
                    </div>
                    <div className='d-flex justify-content-between mt-3'>
                      <div className="header-title">
                        <label className="mb-0">Filter by:</label> <br />
                        <select
                          value={selectedFilter}
                          onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                          <option value="All data">All data</option>
                          <option value="User">User</option>
                          <option value="Employee">Employee</option>
                        </select>
                      </div>
                      <div className="header-title">
                        <label className="mb-0">Show rows:</label>
                        <br />
                        <select
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                          <option value={25}>25</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table
                      id="order-list-table"
                      className="table table-striped"
                      role="grid"
                      data-toggle="data-table"
                    >
                      <thead>
                        <tr className="ligth">
                          <th>No.</th>
                          <th>Client Name</th>
                          <th>Contact no.</th>
                          <th>Total Absent</th>
                          <th>Total Present</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterData(userData)
                          .slice(offset, offset + itemsPerPage)
                          .map((user, index) => {
                            const {
                              totalDays,
                              presentDays,
                              absentDays,
                            } = calculateAttendance(user.client_id)

                            return (
                              <tr key={index}>
                                <td>{offset + index + 1}</td>
                                <td>
                                  {user.first_name + ' ' + user.last_name}
                                </td>
                                <td>{user.contactNumber}</td>
                                <td>{absentDays}</td>
                                <td>{presentDays}</td>
                                <td>
                                  <div className="flex align-items-center list-user-action">
                                    <Button
                                      className="btn btn-success"
                                      onClick={() =>
                                        handleViewAttendance(user.client_id)
                                      }
                                    >
                                      View
                                    </Button>
                                    <Button
                                      style={{ marginLeft: '10px' }}
                                      className="btn"
                                      onClick={() =>
                                        handleOpenModal(user.client_id)
                                      }
                                    >
                                      Add Manual
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="pagination-container">
                    <Stack spacing={2}>
                      <Pagination
                        count={Math.ceil(
                          filterData(userData).length / itemsPerPage,
                        )}
                        page={currentPage + 1}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                      />
                    </Stack>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Fragment>
        {/* Manual Attendance Modal */}
        <Modal show={open} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Manual Attendance</Modal.Title>
          </Modal.Header>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddManualAttendance()
            }}
          >
            <Modal.Body>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="CheckInTime">
                    <Form.Label>Check In Time :</Form.Label>
                    <Form.Control
                      placeholder="Enter Check In Time"
                      type="time"
                      name="CheckInTime"
                      value={manualAttendance.CheckInTime}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="attendanceDate">
                    <Form.Label>Date :</Form.Label>
                    <Form.Control
                      type="date"
                      name="attendanceDate"
                      value={manualAttendance.attendanceDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button className="btn btn-btn btn-primary" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* View Attendance Modal */}
        <Modal
          show={selectedUserAttendance !== null}
          onHide={() => setSelectedUserAttendance(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>View Attendance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUserAttendance && (
              <div>
                <p>Total Days: {selectedUserAttendance.totalDays}</p>
                <p>Present Days: {selectedUserAttendance.presentDays}</p>
                <p>Absent Days: {selectedUserAttendance.absentDays}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setSelectedUserAttendance(null)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </>
  )
}

export default Attendance
