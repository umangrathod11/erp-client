import { useEffect, useState, Fragment } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import Card from '../../../components/Card'
import Swal from 'sweetalert2'
import { Html5QrcodeScanner } from 'html5-qrcode'
import axiosInstance from '../../../js/api'
import { ToastContainer, toast } from 'react-toastify'

function Scanner() {
  const [scanResult, setScanResult] = useState(null)
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    })

    scanner.render(success, error)

    function success(result) {
      try {
        const resultObject = JSON.parse(result)
        scanner.clear()
        setScanResult(resultObject)
        setScanning(false)

        // Validate the QR code
        validateQRCode(resultObject)
      } catch (error) {
        console.warn('Error parsing scan result:', error)
        setScanning(false)
      }
    }

    function error(err) {
      console.warn(err)
      setScanning(false)
    }
  }, [])

  const validateQRCode = async (result) => {
    const today = new Date()
    const membershipEndDate = new Date(result.lastDayOfMembership)

    if (today > membershipEndDate) {
      showSwal('Error', 'Membership has expired.', 'error')
    } else {
      try {
        console.log(result.client_id)
        // Retrieve the stored value from local storage
        const hasTakenAttendanceToday = localStorage.getItem(
          `attendanceTakenToday_${result.client_id}`,
        )

        if (hasTakenAttendanceToday === 'true') {
          toast.warn('Attendance already taken today.')
        } else {
          // Save to local storage that attendance has been taken today for the specific user
          localStorage.setItem(
            `attendanceTakenToday_${result.client_id}`,
            'true',
          )

          const manualAttendance = {
            CheckInTime: new Date().toLocaleTimeString(),
            attendanceDate: today.toISOString().split('T')[0],
            attendanceType: 'Manual',
            personID: result.client_id,
          }

          await axiosInstance.post(
            '/attendance/add-manual-attendance',
            manualAttendance,
          )

          // Show success message
          toast.success('Attendance added successfully!')
        }
      } catch (error) {
        console.error('Error adding manual attendance:', error)
        // Show error message
        toast.error('Error adding manual attendance. Please try again.')
      } finally {
        showSwal('Success', 'Membership is valid.', 'success')
      }
    }
  }

  const showSwal = (title, text, icon) => {
    Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: 'Next',
      cancelButtonText: 'Details',
    }).then((result) => {
      if (result.isConfirmed) {
        setScanning(true)
        window.location.reload()
      }
    })
  }

  return (
    <>
      <div className="margintop">
        <Fragment>
          <div>
            <Row>
              <Col sm="12">
                <Card>
                  <Card.Header className="d-flex justify-content-between">
                    <div className="header-title">
                      <h3 className="card-title">QR Code Scanning</h3>
                    </div>
                  </Card.Header>
                  <Card.Body className="px-3">
                    {scanning ? (
                      <div id="reader" className="scaning-area"></div>
                    ) : (
                      <div className='px-3'>
                        {scanResult ? (
                          <form>
                            <div className="row">
                              <div className="col-12 col-md-12">
                                <h4 className="text-center success-msg">
                                  Success
                                </h4>
                                <div className="row mt-3 ">
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="fname">
                                      Full Name:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="fname"
                                      name="name"
                                      value={scanResult.fullName}
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="fname">
                                      Client ID:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="fname"
                                      name="name"
                                      value={scanResult.client_id}
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="fname">
                                      Join Date:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="fname"
                                      name="name"
                                      value={scanResult.date}
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="days">
                                      Product Name:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="days"
                                      name="days"
                                      value={scanResult.productName}
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="book-date">
                                      Membership Month :
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="book-date"
                                      name="book-date"
                                      value={scanResult.membershipMonth}
                                    />
                                  </Form.Group>
                                  <Form.Group className="col-md-6 form-group">
                                    <Form.Label htmlFor="access">
                                      End Date of Membership:
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="access"
                                      name="access"
                                      value={scanResult.lastDayOfMembership}
                                    />
                                  </Form.Group>
                                  <button
                                    style={{
                                      padding: '5px',
                                      borderRadius: '3px',
                                      backgroundColor: '#186cff',
                                      color: '#fff',
                                    }}
                                  >
                                    OK
                                  </button>
                                </div>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <p>No scan result available.</p>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Fragment>
      </div>
      <ToastContainer />
    </>
  )
}

export default Scanner
