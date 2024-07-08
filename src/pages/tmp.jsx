import React, { useState, useEffect } from 'react';
import "../css/Exchange.css";
import currenciesData from '../json/Exchange.json'; // JSON 파일을 임포트

function Exchange(props) {
    const [curr, setCurr] = useState(''); // 선택된 첫 번째 통화를 저장하는 상태
    const [toCurr, setToCurr] = useState(''); // 선택된 두 번째 통화를 저장하는 상태
    const [currencies, setCurrencies] = useState({}); // 환율 데이터를 저장하는 상태
    const [amount, setAmount] = useState(0); // 첫 번째 입력 필드의 금액을 저장하는 상태
    const [convertedAmount, setConvertedAmount] = useState(0); // 변환된 금액을 저장하는 상태

    // 컴포넌트가 처음 렌더링될 때 JSON 데이터를 상태로 설정
    useEffect(() => {
        setCurrencies(currenciesData);
    }, []);

    // 첫 번째 통화가 변경될 때 호출되는 함수
    const handleCurrChg = (e) => {
        e.preventDefault();
        const newCurr = e.target.textContent;
        setCurr(newCurr);
        updateConvertedAmount(newCurr, toCurr, amount);
    };

    // 두 번째 통화가 변경될 때 호출되는 함수
    const handleToCurrChg = (e) => {
        e.preventDefault();
        const newToCurr = e.target.textContent;
        setToCurr(newToCurr);
        updateConvertedAmount(curr, newToCurr, amount);
    };

    // 드롭다운 메뉴의 항목을 렌더링하는 함수
    const renderDropdownItems = (handleChange) => {
        return Object.keys(currencies).map((cur) => (
            <a href="#" key={cur} onClick={handleChange}>{cur}</a>
        ));
    }

    // 첫 번째 입력 필드의 값이 변경될 때 호출되는 함수
    const convert = (e) => {
        if (!curr || !toCurr) {
            alert("화폐를 선택 하시오.");
            return;
        }
        const inputAmount = parseFloat(e.target.value);
        setAmount(inputAmount);
        const rate = currencies[curr][toCurr];
        setConvertedAmount(inputAmount * rate);
    };

    // 두 번째 입력 필드의 값이 변경될 때 호출되는 함수
    const convertBack = (e) => {
        if (!curr || !toCurr) {
            alert("화폐를 선택 하시오.");
            return;
        }
        const inputConvertedAmount = parseFloat(e.target.value);
        setConvertedAmount(inputConvertedAmount);
        const rate = currencies[toCurr][curr];
        setAmount(inputConvertedAmount * rate);
    };

    // 선택된 통화가 변경될 때 호출되는 함수
    const updateConvertedAmount = (c, t, amt) => {
        if (c && t) {
            const rate = currencies[c][t];
            setConvertedAmount(amt * rate);
        }
    };

    return (
        <div className={"top-class"}>
            <div className="main-class">
                {/* 첫 번째 통화를 선택하는 드롭다운 */}
                <div className="dropdown">
                    <button className="dropbtn">{curr}</button>
                    <div className="dropdown-content">
                        {renderDropdownItems(handleCurrChg)}
                    </div>
                </div>

                {/* 첫 번째 금액 입력 필드 */}
                <div>
                    <input
                        className="input-area"
                        type="number"
                        value={amount}
                        onChange={convert}
                    />
                    <div className={"bottom-div"}>{currencies[curr]?.unit || ''}</div>
                </div>
            </div>

            <div style={{ flex: 1, textAlign: "center", width: "400px" }}>
                <h1>=</h1>
            </div>

            <div className="main-class">
                {/* 두 번째 통화를 선택하는 드롭다운 */}
                <div className="dropdown">
                    <button className="dropbtn">{toCurr}</button>
                    <div className="dropdown-content">
                        {renderDropdownItems(handleToCurrChg)}
                    </div>
                </div>

                {/* 두 번째 금액 입력 필드 */}
                <div>
                    <input
                        className="input-area"
                        type="number"
                        value={convertedAmount}
                        onChange={convertBack}
                    />
                    <div className={"bottom-div"}>{currencies[toCurr]?.unit || ''}</div>
                </div>
            </div>
        </div>
    );
}

export default Exchange;
