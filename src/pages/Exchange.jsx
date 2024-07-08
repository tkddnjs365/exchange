import React, { useState, useEffect } from 'react';
import '../css/Exchange.css'; // Exchange 컴포넌트에 적용할 스타일 시트를 임포트합니다.
import currenciesData from '../json/Exchange.json'; // 환율 데이터가 포함된 JSON 파일을 임포트합니다.

function Exchange(props) {
    const [curr, setCurr] = useState(''); // 선택된 첫 번째 통화를 저장하는 상태
    const [currencies, setCurrencies] = useState({}); // 환율 데이터를 저장하는 상태
    const [checkedFirstCurrencies, setCheckedFirstCurrencies] = useState([]); // 첫 번째 통화 선택 항목을 저장하는 상태
    const [checkedSecondCurrencies, setCheckedSecondCurrencies] = useState([]); // 두 번째 통화 선택 항목을 저장하는 상태
    const [amount, setAmount] = useState(''); // 입력된 금액을 저장하는 상태
    const [boxQty, setBoxQty] = useState(0); // 값 나오는 박스 갯수
    const [boxStates, setBoxStates] = useState([ // 각 박스의 상태를 저장하는 배열
        {
            toCurr: '',
            convertedAmount: ''
        }
    ]);

    // 컴포넌트가 처음 렌더링될 때 환율 데이터 설정
    useEffect(() => {
        setCurrencies(currenciesData);
    }, []);

    // 첫 번째 통화 선택 항목을 클릭했을 때 호출되는 함수
    const handleFirstCurrencyChange = (e) => {
        const newCurr = e.target.id.replace(/^first-/, ''); // 체크박스의 id에서 'first-' 제거하여 새로운 통화 코드 생성
        setCheckedFirstCurrencies((a) =>
            a.includes(newCurr) // 선택된 통화 목록에 이미 포함되어 있는 경우
                ? a.filter((curr) => curr !== newCurr) // 해당 통화를 제외하고 배열을 업데이트
                : [...a, newCurr] // 선택된 통화 목록에 새로운 통화를 추가하여 배열을 업데이트
        );
    };

    // 두 번째 통화 선택 항목을 클릭했을 때 호출되는 함수
    const handleSecondCurrencyChange = (e) => {
        const newCurr = e.target.id.replace(/^second-/, ''); // 체크박스의 id에서 'second-' 제거하여 새로운 통화 코드 생성
        setCheckedSecondCurrencies((prev) =>
            prev.includes(newCurr) // 선택된 통화 목록에 이미 포함되어 있는 경우
                ? prev.filter((curr) => curr !== newCurr) // 해당 통화를 제외하고 배열을 업데이트
                : [...prev, newCurr] // 선택된 통화 목록에 새로운 통화를 추가하여 배열을 업데이트
        );
        setBoxQty((prev) =>
            checkedSecondCurrencies.includes(newCurr) ? prev - 1 : prev + 1
        );
    };

    // 드롭다운에 표시할 첫 번째 통화 선택 항목 렌더링
    const renderFirstCurrencyList = () => {
        return Object.keys(currencies).map((cur) => (
            <div key={cur}>
                <input
                    type="checkbox"
                    id={`first-${cur}`} // 첫 번째 통화 리스트 체크박스의 id 설정
                    checked={checkedFirstCurrencies.includes(cur)} // 선택 여부를 checked 속성으로 관리
                    onChange={handleFirstCurrencyChange} // 체크박스 변경 시 handleFirstCurrencyChange 함수 호출
                />
                <label htmlFor={`first-${cur}`}>{cur}</label>
            </div>
        ));
    };

    // 드롭다운에 표시할 두 번째 통화 선택 항목 렌더링
    const renderSecondCurrencyList = () => {
        return Object.keys(currencies).map((cur) => (
            <div key={cur}>
                <input
                    type="checkbox"
                    id={`second-${cur}`} // 두 번째 통화 리스트 체크박스의 id 설정
                    checked={checkedSecondCurrencies.includes(cur)} // 선택 여부를 checked 속성으로 관리
                    onChange={handleSecondCurrencyChange} // 체크박스 변경 시 handleSecondCurrencyChange 함수 호출
                />
                <label htmlFor={`second-${cur}`}>{cur}</label>
            </div>
        ));
    };

    // 선택된 항목들을 드롭다운 형태로 렌더링
    const renderDropdownItems = (currencyList, boxIndex, isFirstCurrency) => {
        return currencyList.map((cur) => (
            <a href="#" key={cur} onClick={() => handleCurrencySelection(currencyList, cur, boxIndex, isFirstCurrency)}>
                {cur}
            </a>
        ));
    };

    // 선택된 항목을 드롭다운에 적용하는 함수
    const handleCurrencySelection = (currencyList, currency, boxIndex, isFirstCurrency) => {
        if (isFirstCurrency) {
            setCurr(currency); // 첫 번째 통화 선택 상태 업데이트
        } else {
            const newBoxStates = [...boxStates];
            newBoxStates[boxIndex].toCurr = currency;
            setBoxStates(newBoxStates); // 두 번째 통화 선택 상태 업데이트
        }
    };

    // 첫 번째 입력 필드 값 변경 시 호출되는 함수
    const handleAmountChange = (e) => {
        const inputAmount = e.target.value; // 입력된 값 가져오기
        setAmount(inputAmount); // 입력된 금액 상태 업데이트
        boxStates.forEach((box, index) => {
            if (curr && box.toCurr) {
                const rate = currencies[curr][box.toCurr]; // 선택된 통화 간의 환율 가져오기
                const newBoxStates = [...boxStates];
                newBoxStates[index].convertedAmount = (parseFloat(inputAmount) * rate).toFixed(3); // 변환된 금액 계산 및 상태 업데이트
                setBoxStates(newBoxStates);
            }
        });
    };

    // 두 번째 입력 필드 값 변경 시 호출되는 함수
    const handleConvertedAmountChange = (e, boxIndex) => {
        const inputConvertedAmount = e.target.value; // 입력된 값 가져오기
        const newBoxStates = [...boxStates];
        newBoxStates[boxIndex].convertedAmount = inputConvertedAmount; // 변환된 금액 상태 업데이트
        setBoxStates(newBoxStates);
        if (curr && newBoxStates[boxIndex].toCurr) {
            const rate = currencies[newBoxStates[boxIndex].toCurr][curr]; // 선택된 통화 간의 역환율 가져오기
            setAmount((parseFloat(inputConvertedAmount) * rate).toFixed(3)); // 첫 번째 입력 필드에 반대로 계산된 금액 상태 업데이트
        }
    };

    // 박스 렌더링을 위한 함수
    const renderConversionBoxes = () => {
        const boxes = [];
        // boxQty에 맞게 boxStates 배열을 확장
        while (boxStates.length < boxQty) {
            boxStates.push({ toCurr: '', convertedAmount: '' });
        }
        for (let i = 0; i < boxQty; i++) {
            boxes.push(
                <div className="main-class" key={i}>
                    <div className="dropdown">
                        <button className="dropbtn">{boxStates[i]?.toCurr}</button>
                        <div className="dropdown-content">
                            {renderDropdownItems(checkedSecondCurrencies, i, false)}
                        </div>
                    </div>
                    <div>
                        <input
                            className="input-area"
                            type="number"
                            value={boxStates[i]?.convertedAmount}
                            onChange={(e) => handleConvertedAmountChange(e, i)}
                        />
                        <div className={"bottom-div"}>{currencies[boxStates[i]?.toCurr]?.unit || ''}</div> {/* 선택된 통화의 단위 표시 */}
                    </div>
                </div>
            );
        }
        return boxes;
    };

    return (
        <div className="top-class">
            <div className="checklist-container">
                <div className="checklist">
                    <h3>첫 번째 통화 선택 리스트</h3>
                    {renderFirstCurrencyList()}
                </div>

                <div className="checklist">
                    <h3>두 번째 통화 선택 리스트</h3>
                    {renderSecondCurrencyList()}
                </div>
            </div>

            <div className="main-class">
                <div className="dropdown">
                    <button className="dropbtn">{curr}</button>
                    <div className="dropdown-content">
                        {renderDropdownItems(checkedFirstCurrencies, null, true)}
                    </div>
                </div>

                <div>
                    <input
                        className="input-area"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                    <div className={"bottom-div"}>{currencies[curr]?.unit || ''}</div> {/* 선택된 통화의 단위 표시 */}
                </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center', width: '400px' }}>
                <h1>=</h1>
            </div>

            {renderConversionBoxes()} {/* 박스 렌더링 함수 호출 */}

        </div>
    );
}

export default Exchange;
