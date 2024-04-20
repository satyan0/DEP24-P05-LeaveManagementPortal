import React, { useState, useRef, useEffect } from 'react'
import httpClient from '../../httpClient';
import "./ApplyForm.css"
import LoadingIndicator from '../LoadingIndicator';
import { useAuth } from '../../contexts/AuthContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import "./Form.css";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function FacultyEditApplication({ toast }) {

	const params = useParams();
	const id = params.id;

	const [leave, setLeave] = useState({});
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const [typesOfLeave, setTypesofLeave] = useState(["CASUAL LEAVE", "RESTRICTED HOLIDAY", "SPECIAL CASUAL LEAVE"])
	const [duration, setDuration] = useState(0);
	const [document, setDocument] = useState();
	const [fileName, setFileName] = useState("");
	const [displaySpecialFields, setDisplaySpecialFields] = useState("none");
	const [displayStationLeaveDates, setDisplayStationLeaveDates] = useState("");
	const [dateErrorMessage, setDateErrorMessage] = useState("");
	const [formLoading, setFormLoading] = useState(false);
	const [sigUrl, setSigUrl] = useState("");
	const [disablButton, setDisableButton] = useState(false);

	const sigPadRef = useRef();
	const formRef = useRef()


	const getLeavesInfo = async () => {
        try {
            const response = await httpClient.post(
				`${process.env.REACT_APP_API_HOST}/get_leave_info_by_id`,
				{ leave_id: id }
			  );
			const leave = response.data.data[0];
			console.log(leave);
			setLeave(leave);
			if (leave.is_station == 'Yes') {
				setDisplayStationLeaveDates("");
			} else {
				setDisplayStationLeaveDates("none")
			}
			if (leave.nature == "Casual Leave") {
				setDisplaySpecialFields("none")
				setTypesofLeave(["CASUAL LEAVE", "RESTRICTED HOLIDAY", "SPECIAL CASUAL LEAVE"])
			} else {
				setDisplaySpecialFields("")
				setTypesofLeave(["Earned Leave", "Half Pay Leave", "Extra Ordinary Leave", "Commuted Leave", "Vacation", "Maternity Leave", "Paternity Leave", "Child Care Leave"])
			}
        } catch (error) {
            console.error('Error fetching leaves information:', error);
            // Handle error, display error message, etc.
        }
    };

    useEffect(() => {
        // Call the function to fetch leaves information when component mounts
        getLeavesInfo();
    }, []);


	function dataURItoBlob(dataURI) {
		const byteString = atob(dataURI.split(',')[1]);
		const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: mimeString });
	}

	function getToday() {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0"); // add leading zero if needed
		const day = String(today.getDate()).padStart(2, "0"); // add leading zero if needed
		const todayString = `${year}-${month}-${day}`;
		return todayString
	}

	const handleInputChange = async (e) => {
		const { id, value } = e.target;
		setLeave((leave) => ({
			...leave,
			[id]: value
		}));
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		const fileSize = file.size;
		setDocument(file)
		if (fileSize > 1 * 1024 * 1024) {
			alert("File size must be less than 1MB");
			return;
		}
		setFileName(`${currentUser.user_id}_${Date.now()}_${file.name}`);
	};	

	const clear = () => {
		sigPadRef.current.clear();
	};

	useEffect(() => {
		setSigUrl(currentUser.signature)
	}, [])



	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			let form_data = {}
			form_data['leave_id'] = leave.leave_id;
			formRef.current.querySelectorAll('input').forEach((input) => {
				if (input.type == "file") {
					return;
				}
				form_data[input.id] = input.value == '' ? null : input.value;
			});
			formRef.current.querySelectorAll('select').forEach((input) => {
				form_data[input.id] = input.value == '' ? null : input.value;
			});
			formRef.current.querySelectorAll('textarea').forEach((input) => {
				form_data[input.id] = input.value == '' ? null : input.value;
			});
			if (form_data['is_station'] == 'No') {
				form_data['station_start_date'] = null;
				form_data['station_end_date'] = null;
			}
			form_data['form_rdate'] = getToday()
			if (!sigUrl) {
				form_data['signature'] = null;
				// toast.error("Signature can't be kept empty", toast.POSITION.BOTTOM_RIGHT);
				// setFormLoading(false);
				// return;
			} else {
				const arrayBuffer = await dataURItoBlob(sigUrl).arrayBuffer();
				const binaryData = new Uint8Array(arrayBuffer);			
				// return;
				form_data['signature'] = binaryData;
			}
			if (form_data['start_date'] && form_data['end_date'] && (form_data['end_date'] < form_data['start_date'])) {
				setDateErrorMessage('Start date must be less than end date');
				return;
			}			
			if (form_data['station_start_date'] && form_data['station_end_date'] && (form_data['station_start_date'] > form_data['station_end_date'])) {
				setDateErrorMessage('Station Start date must be less than end date');
				return;
			}
			if (form_data['suffix_start_date'] && form_data['suffix_end_date'] && (form_data['suffix_start_date']  > form_data['suffix_end_date'])) {
				setDateErrorMessage('Suffix Start date must be less than end date');
				return;
			}
			if (form_data['prefix_start_date'] && form_data['prefix_end_date'] && (form_data['prefix_start_date']  > form_data['prefix_end_date'])) {
				setDateErrorMessage('Prefix Start date must be less than end date');
				return;
			}
			// return;
			setFormLoading(true);
						
			form_data['form_filename'] = fileName;
			// return;
			const form = new FormData();
			form.append('data', JSON.stringify(form_data));
			form.append('file', document);
			try {
				const resp = await httpClient.post(`${process.env.REACT_APP_API_HOST}/edit_leave`, form);
				if (resp.data.status == 'success') {
					toast.success(resp.data.data, toast.POSITION.BOTTOM_RIGHT);
					setTimeout(() => {
						navigate("/navigate/pastapplications");
					}, 2000);
				} else {
					toast.error(resp.data.emsg, toast.POSITION.BOTTOM_RIGHT)
				}
			} catch (error) {
				toast.error("Leave Application Unssucessful", toast.POSITION.BOTTOM_RIGHT)
			}
			setFormLoading(false);
		} catch (error) {
			console.log(error)
		}
	}


	const handleTypeOfLeave = (e) => {
		const propVal = e.target.value;
		if (propVal == "Casual Leave") {
			setDisplaySpecialFields("none")
			setTypesofLeave(["CASUAL LEAVE", "RESTRICTED HOLIDAY", "SPECIAL CASUAL LEAVE"])
		} else {
			setDisplaySpecialFields("")
			setTypesofLeave(["Earned Leave", "Half Pay Leave", "Extra Ordinary Leave", "Commuted Leave", "Vacation", "Maternity Leave", "Paternity Leave", "Child Care Leave"])
		}
	}

	if (!currentUser?.name || currentUser?.name == '') {
		toast.error("You need to add you name on your profile section by clicking on edit icon", toast.POSITION.BOTTOM_RIGHT);
		setTimeout(() => {
			navigate("/");
		}, 3000);
	}


	return (
		<div className="container-al">
			<Card style={{ width: "100%" }}>
				<Card.Body style={{ width: "100%" }}>
					<Card.Title className="title-al" >Edit Leave</Card.Title>
					<Card.Text>
						<form ref={formRef} onSubmit={async (e) => { 
							setDisableButton(true);
							await handleSubmit(e)
							setDisableButton(false);
							}}>
							<Container className="content-al">
								<div className="user-details-al">
									<div className="input-box-al">
										<div className="details-al">
											<Row className="row-al">
												<Col className="col-al">
													<legend htmlFor="form_name" style={{ fontSize: "18px" }}>Name  <span style={{color: "red"}}>*</span></legend>
													<input required type="text" className="form-control" style={{ cursor: "not-allowed" }} id="form_name" value={currentUser.name} onChange={(e) => { handleInputChange(e) }} placeholder="Name" readonly disabled />
												</Col >
												<Col className="col-al">
													<legend htmlFor="form_email" style={{ fontSize: "18px" }}>Email  <span style={{color: "red"}}>*</span></legend>
													<input required type="email" className="form-control" style={{ cursor: "not-allowed" }} id="form_email" value={currentUser.email} onChange={(e) => { handleInputChange(e) }} placeholder="Email" readonly disabled />
												</Col >
											</Row >
											<Row className="row-al">
												<Col className="col-al">
													<legend htmlFor="form_phone" style={{ fontSize: "18px" }}>Phone Number</legend>
													<input required type="tel" className="form-control" id="form_phone" defaultValue={currentUser.mobile} onChange={(e) => { handleInputChange(e) }} placeholder="Phone Number" readonly disabled/>
												</Col >
												<Col className="col-al">
													<legend htmlFor="form_nature" style={{ fontSize: "18px" }}>Nature of leave  <span style={{color: "red"}}>*</span></legend>
													<select required className="form-control" id="nature" value={leave.nature} onChange={(e) => { handleInputChange(e); handleTypeOfLeave(e) }}>
														<option value="">-- Select an option --</option>
														<option>Casual Leave</option>
														<option>Non Casual Leave</option>
													</select>
												</Col >
											</Row >
											<Row className="row-al">
												<Col className="col-al">
													<legend htmlFor="form_type_of_leave" style={{ fontSize: "18px" }}>Type of leave  <span style={{color: "red"}}>*</span></legend>
													<select required className="form-control" id="type_of_leave" value={leave.type_of_leave} onChange={(e) => { handleInputChange(e) }}>
														<option value="">-- Select an option --</option>
														{
															typesOfLeave.map((item, key) => {
																return (
																	<option key={key}>{item}</option>
																)
															})
														}
													</select>
												</Col >
												<Col className="col-al">
													<legend htmlFor="form_isStation" style={{ fontSize: "18px" }}>Is it a station leave?</legend>
													<select required className="form-control" id="is_station" value={leave.is_station} onChange={(e) => {
														handleInputChange(e);
														if (e.target.value == 'Yes') {
															setDisplayStationLeaveDates("");
														} else {
															setDisplayStationLeaveDates("none")
														}
													}}>
														<option>Yes</option>
														<option>No</option>
													</select>
												</Col >
												<Col className="col-al">
													<legend htmlFor="form_duration" style={{ fontSize: "18px" }}>Duration of leave  <span style={{color: "red"}}>*</span></legend>
													<input required type="number" className="form-control" id="duration" value={leave.duration} placeholder="Duration" onChange={async (e) => handleInputChange(e)}/>
												</Col >
											</Row >
											{
												displayStationLeaveDates == "none" ? "" : (
													<Row className="row-al" style={{ display: displayStationLeaveDates }}>
														<Col className="col-al">
															<legend htmlFor="form_station_sdate" style={{ fontSize: "18px" }}>Station Leave Start Date</legend>
															<input required type="date" id="station_start_date" placeholder="Pick start date" className="form-control" value={leave.station_start_date ? new Date(leave.station_start_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }}></input>
														</Col >
														<Col className="col-al">
															<legend htmlFor="form_station_edate" style={{ fontSize: "18px" }}>Station Leave End Date</legend>
															<input required type="date" id="station_end_date" placeholder="Pick end date" className="form-control" value={leave.station_end_date ? new Date(leave.station_end_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }}></input>
														</Col >
													</Row >
												)
											}

											<Row className="row-al">
												<Col className="col-al">
													<legend htmlFor="form_sdate" style={{ fontSize: "18px" }}>Start Date  <span style={{color: "red"}}>*</span></legend>
													<input required type="date" id="start_date" placeholder="Pick start date" className="form-control" value={leave.start_date ? new Date(leave.start_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }}></input>
												</Col >
												<Col className="col-al">
													<legend htmlFor="form_edate" style={{ fontSize: "18px" }}>End Date  <span style={{color: "red"}}>*</span></legend>
													<input required type="date" id="end_date" placeholder="Pick end date" className="form-control" value={leave.end_date ? new Date(leave.end_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }} ></input>
												</Col >
											</Row >

											{
												displaySpecialFields == "none" ? "" : (
													<>
														<Row className="row-al" style={{ display: displaySpecialFields }}>
															<Col className="col-12">
																<p style={{ textAlign: "left", marginBottom: "2px", textDecoration: "underline" }}>Sunday and Holiday, if any, proposed to be prefixed/suffixed to leave: </p>
															</Col >

														</Row >

														<Row className="row-al" style={{ display: displaySpecialFields }}>
															<Col className="col-4">
																<legend htmlFor="form_suffs" style={{ fontSize: "16px" }}>Suffix Start Date</legend>
																<input type="date" id="suffix_start_date" placeholder="Pick suffix start date" className="form-control" value={leave.suffix_start_date_start_date ? new Date(leave.suffix_start_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }}></input>
															</Col >
															<Col className="col-4">
																<legend htmlFor="form_suffe" style={{ fontSize: "16px" }}>Suffix End Date</legend>
																<input type="date" id="suffix_end_date" placeholder="Pick suffix end date" className="form-control" value={leave.suffix_end_date ? new Date(leave.suffix_end_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }}></input>
															</Col >
															<Col className="col-4">
																<legend htmlFor="form_suffduration" style={{ fontSize: "16px" }}>Duration of suffix</legend>
																<input type="number" className="form-control" id="form_suffduration" placeholder="Suffix Duration" />
															</Col >
														</Row >

														<Row className="row-al" style={{ display: displaySpecialFields }}>
															<Col className="col-4">
																<legend htmlFor="form_pres" style={{ fontSize: "16px" }}>Prefix Start Date</legend>
																<input type="date" id="prefix_start_date" placeholder="Pick prefix start date" className="form-control" value={leave.prefix_end_date ? new Date(leave.prefix_end_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }}></input>
															</Col >
															<Col className="col-4">
																<legend htmlFor="form_pree" style={{ fontSize: "16px" }}>Prefix End Date</legend>
																<input type="date" id="prefix_end_date" placeholder="Pick prefix end date" className="form-control" value={leave.prefix_end_date ? new Date(leave.prefix_end_date).toISOString().split('T')[0] : ''} onChange={async (e) => { handleInputChange(e) }}></input>
															</Col >
															<Col className="col-4">
																<legend htmlFor="form_preduration" style={{ fontSize: "16px" }}>Duration of Prefix</legend>
																<input type="number" className="form-control" id="form_preduration" placeholder="Prefix Duration" />
															</Col >
														</Row >
													</>
												)
											}


											<Row className="row-al">
												<Col className="col-al">
													<legend htmlFor="form_purpose" style={{ fontSize: "18px" }}>Purpose of leave </legend>
													<textarea id="purpose" className="form-control" value={leave.purpose} onChange={(e) => { handleInputChange(e) }}>

													</textarea>
												</Col>
												<Col className="col-al">
													<legend htmlFor="form_altArrangements" style={{ fontSize: "18px" }}>Alternative Arrangements</legend>
													<textarea id="alt_arrangements" className="form-control" value={leave.alt_arrangements} onChange={(e) => { handleInputChange(e) }}>

													</textarea>
												</Col>
											</Row>

											<Row className="row-al">
												<Col className="col-al">
													<legend htmlFor="form_address" style={{ fontSize: "18px" }}>Address During Leave</legend>
													<textarea id="address" className="form-control" value={leave.address} onChange={(e) => { handleInputChange(e) }}>

													</textarea>
												</Col>
											</Row>
											<div
												style={{
													textAlign: "left",
												}}
											>
												<input
													type="file"
													accept=".pdf"
													style={{ border: "none" }}
													onChange={handleFileInputChange}
													max="1000000"
												/>
												
											</div>

											{/* <br />
											<Row className="row-al">
												<Col className="col-al">
													<legend htmlFor="form_document" style={{ fontSize: "18px" }}>Document</legend>
													<input
														type="file"
														id="pdfFileInput"
														accept=".pdf"
														onChange={handleFileInputChange}
													/>
												</Col >
											</Row> */}
											<br />

											<Row className="row-al">
												<span style={{ textAlign: "left" }}>Your signature will appear here if you have updated this in you profile section<br /></span>
											</Row>

											<Row className='row-al'>
												<div className='signature-box'>
													<img src={sigUrl} style={{
														maxHeight: "60px",
														maxWidth: "450px",
														width: "40%",
													}}>
													</img>
												</div>
											</Row>
											<Row className="row-al">
												<Col>
													<button type="submit" disabled={disablButton} className="btn btn-primary btn-block">{formLoading ? <LoadingIndicator color={"white"}></LoadingIndicator> : "Edit Leave"}</button>
													<span style={{color: "red"}}><br />{dateErrorMessage}</span>
												</Col>
											</Row>
										</div>
									</div>
								</div>
							</Container>
						</form>
					</Card.Text>
				</Card.Body>
			</Card>
		</div >


	)
}
