import { React, useState, useEffect, setState } from 'react'
import './dashboard.css';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container'
import { getLeaderBoard, getUserDetails, lastSevenDays, updateData } from '../../functions/userData';

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns';

import { Bar, Line } from 'react-chartjs-2'
import { min } from 'date-fns/esm';

import { useWindowSize } from '@react-hook/window-size'
import Confetti from 'react-confetti'

import vadivelu from "../../assets/vadivelu.png"



const Dashboard = () => {

    let navigate = useNavigate()
    const [fName, setFName] = useState()
    const [lName, setLName] = useState()
    const [email, setemail] = useState()
    const [daysWokeUpArray, setDaysWokeUpArray] = useState([])
    const [totalDaysWokeUp, setTotalDaysWokeUp] = useState()
    const [buttonStatus, setButtonStatus] = useState('missed')
    const [time, setTime] = useState()
    const [minDate, setMinDate] = useState()
    const [daysWokeUp, setDaysWokeUp] = useState([])
    const [leaderBoard, setLeaderBoard] = useState()
    const [confettiState, setConfettiState] = useState(false)


    useEffect(() => {

        async function get() {
            if (localStorage.getItem("auth")) {
            } else {
                navigate('/home')
            }
            const data = await getUserDetails()
            const graph = await lastSevenDays()
            const table = await getLeaderBoard()
            setLeaderBoard(table)
            setDaysWokeUp(graph.wokeUp)
            setMinDate(graph.min)
            setFName(data.fName)
            setLName(data.lName)
            setDaysWokeUpArray(data.daysWokeUpArray)
            setTotalDaysWokeUp(data.totalDaysWokeUp)

            let d = new Date()
            let latestDate = data.daysWokeUpArray[data.daysWokeUpArray.length - 1] || 0
            let l = new Date(latestDate.seconds * 1000)
            console.log(d.toDateString())
            console.log(l.toDateString())
            if (d.getHours() > 4 && d.getHours() < 6 && (d.toDateString() != l.toDateString())) {
                setButtonStatus('available')
            } else if (d.toDateString() == l.toDateString()) {
                setButtonStatus('unavailable')
            }
        }

        get()
        let d = new Date()
        setInterval(() => {
            let d = new Date()
            const weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
            let day = weekday[d.getDay()];
            setTime(day + " " + d.toLocaleTimeString());
        }, 1000);
        d = d.getHours()



    }, []);


    async function handleButton() {
        await updateData()
        setConfettiState(true)
        setButtonStatus('unavailable')
        function reload() {
            window.location.reload()
        }
        setTimeout(reload, 3000)
    }

    function WakeButton() {
        if (buttonStatus == "available") {
            return (
            <>
                <Button variant="success" onClick={handleButton} >I WOKE UP!</Button>
                <br></br>
                <sub>Click the button to note down that you woke up.</sub>
            </>)
        } else if (buttonStatus == "unavailable") {
            return (
            <>
                <Button variant="success" disabled>YOU WOKE UP!</Button>
                <br></br>
                <sub>Button available between 4:00AM and 6:00AM Local Time</sub>
            </>)

        } else if (buttonStatus == "missed") {
            return (
            <>
                <Button variant="danger" disabled>Oops! You missed it.</Button>
                <br></br>
                <sub>Button available between 4:00AM and 6:00AM Local Time</sub>
            </>)
        }
    }

    return (
        <div className="Dashboard">

            <div className="Header">
                {confettiState ? <Confetti
                    width={1000}
                    height={900}
                /> : null}
                <Navbar bg="light" expand="lg" fixed="top">
                    <Container>
                        <Navbar.Brand href="#home"><img
                            src={vadivelu}
                            width="120"
                            height="50"
                            className="d-inline-block align-top"
                        /></Navbar.Brand>
                        <Navbar.Brand href="#home"></Navbar.Brand>
                        <Nav.Link onClick={() => {
                            navigate('/home')
                            localStorage.setItem('auth', "loggedOut")
                        }} style={{ padding: "5px", backgroundColor: "red", color: "white", border: "1px solid red", borderRadius: "12px" }}>Log Out</Nav.Link>

                    </Container>
                </Navbar>
            </div>

            <div className="Tab">
                <Tabs defaultActiveKey="home" id="tab" className="tab">
                    <Tab id="tab" eventKey="home" title="Dashboard" className="innerTab">
                        <div className="topView">
                            <h6>{time}</h6>
                            <h6>Welcome <i>{fName}!</i></h6>

                        </div>
                        <hr></hr>
                        <div className="buttonTab">
                            <WakeButton />

                        </div>
                        <hr></hr>
                        <h6>Last 7 days</h6>
                        <Bar
                            data={{
                                datasets: [
                                    {
                                        label: 'Woke Up on Time!',
                                        data: daysWokeUp,
                                        borderWidth: 1,
                                        backgroundColor: '#198754'
                                    }
                                ]
                            }}
                            width={700}
                            height={250}
                            interaction={{
                                intersect: false,
                                mode: 'index'
                            }}
                            options={{
                                indexAxis: 'x',
                                scales: {
                                    x: {
                                        stacked: true,
                                        type: 'time',
                                        time: {
                                            unit: 'day'
                                        },
                                        min: minDate,
                                        max: new Date(),
                                        title: {
                                            display: true,
                                            text: 'Date'
                                        },
                                    },
                                    y: {
                                        type: 'time',
                                        time: {
                                            unit: 'hour'
                                        },
                                        stacked: true,
                                        title: {
                                            display: true,
                                        },
                                        ticks: {
                                            display: false
                                        },
                                        max: 1,
                                        min: 0
                                    },
                                },
                                parsing: {
                                    xAxisKey: 'x',
                                    yAxisKey: 'y'
                                },
                                plugins: {
                                    tooltip: {
                                        enabled: false
                                    },
                                }
                            }}
                        />


                    </Tab>
                    <Tab activeColor="ghostwhite" id="tab" eventKey="leaderboard" title="Leaderboard">
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th># Days Woke Up</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderBoard ? leaderBoard.map((data) => (
                                    <tr>
                                        <td style={{ textAlign: "center" }}></td>
                                        <td>{data.name}</td>
                                        <td style={{ textAlign: "center" }}>{data.totalDays}</td>
                                    </tr>
                                )) : null}
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Dashboard