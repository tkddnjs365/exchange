import React, { useState, useEffect } from 'react';
import '../css/Exchange.css'; // Exchange 컴포넌트에 적용할 스타일 시트를 임포트합니다.
import currenciesData from '../json/Exchange.json'; // 환율 데이터가 포함된 JSON 파일을 임포트합니다.

function Exchange() {
    const [curr, setCurr] = useState(''); // 선택된 첫 번째 통화를 저장하는 상태
    const [currencies, setCurrencies] = useState({}); // 환율 데이터를 저장하는 상태
    const [checkedSecondCurrencies, setCheckedSecondCurrencies] = useState([]); // 두 번째 통화 선택 항목을 저장하는 상태
    const [amount, setAmount] = useState(''); // 입력된 금액을 저장하는 상태
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


    // 드롭다운에 표시할 첫 번째 통화 선택 항목 렌더링
    const renderFirstCurrencyList = () => {
        return Object.keys(currencies).map((cur) => (
            <div key={cur}>
                <input
                    type="radio"
                    id={`first-${cur}`} // 첫 번째 통화 리스트 체크박스의 id 설정
                    checked={curr === cur} // 선택 여부를 checked 속성으로 관리
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

    // 첫 번째 통화 선택 항목을 클릭했을 때 호출되는 함수
    const handleFirstCurrencyChange = (e) => {
        const newCurr = e.target.id.replace(/^first-/, ''); // 체크박스의 id에서 'first-' 제거하여 새로운 통화 코드 생성
        setCurr(newCurr); // 선택된 첫 번째 통화 업데이트+

        //라디오 값을 바꾸면 값 계산 바로 해주기
        boxStates.forEach((box, index) => {
            if (newCurr && box.toCurr) {
                const rate = currencies[newCurr][box.toCurr]; // 선택된 통화 간의 환율 가져오기
                const newBoxStates = [...boxStates];
                newBoxStates[index].convertedAmount = (parseFloat(amount) * rate).toFixed(3); // 변환된 금액 계산 및 상태 업데이트
                setBoxStates(newBoxStates);
            }
        });
    };

    // 두 번째 통화 선택 항목을 클릭했을 때 호출되는 함수
    const handleSecondCurrencyChange = (e) => {
        const newCurr = e.target.id.replace(/^second-/, ''); // 체크박스의 id에서 'second-' 제거하여 새로운 통화 코드 생성
        const isChecked = e.target.checked;

        if (isChecked) {
            setCheckedSecondCurrencies(prev => [...prev, newCurr]); // 선택된 통화 목록에 추가
        } else {
            setCheckedSecondCurrencies(prev => prev.filter(curr => curr !== newCurr)); // 선택 해제된 통화를 제외하고 업데이트
        }
    };

    // useEffect를 사용하여 checkedSecondCurrencies가 업데이트 될 때 boxStates를 업데이트
    useEffect(() => {

        const newBoxStates = checkedSecondCurrencies.map(currency => ({
            toCurr: currency,
            convertedAmount: curr === '' ? '' : (parseFloat(amount) * currencies[curr][currency]).toFixed(3),
        }));
        setBoxStates(newBoxStates);
    }, [checkedSecondCurrencies, amount, curr, currencies]);

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
        return boxStates.map((box, index) => (
            <div className="main-class" key={index}>
                <div className="dropdown">
                    <button className="dropbtn">{box.toCurr}</button>
                </div>
                <div>
                    {box.toCurr && (
                        <input
                            className="input-area"
                            type="number"
                            value={box.convertedAmount || ''}
                            onChange={(e) => handleConvertedAmountChange(e, index)}
                        />
                    )}
                    <div className={"bottom-div"}>
                        {formatNumber(box.convertedAmount || '')} {currencies[box.toCurr]?.unit || ''}
                    </div>
                    {/* 선택된 통화의 단위 표시 */}
                </div>
            </div>
        ));
    };

    // 숫자 포맷팅 함수
    const formatNumber = (number) => {
        if (number === '' || isNaN(number)) {
            return '';
        }
        return new Intl.NumberFormat().format(number);
    };
    return (
        <div className="top-class">
            <div className="checklist-container">
                <div className="checklist">
                    <h3>메인 화폐</h3>
                    {renderFirstCurrencyList()}
                </div>

                <div className="checklist">
                    <h3>계산 화폐</h3>
                    {renderSecondCurrencyList()}
                </div>
            </div>

            <div className="main-class">
                <div className="dropdown">
                    <button className="dropbtn">{curr}</button>
                </div>

                <div>
                    <input
                        className="input-area"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                    <div className={"bottom-div"}>{formatNumber(amount)} {currencies[curr]?.unit || ''}</div> {/* 입력된 금액을 포맷팅하여 표시 */}
                </div>
            </div>

            <div style={{flex: 1, textAlign: 'center', width: '100%'}}>
                <h1 style={{margin: 0}}>=</h1>
            </div>

            {renderConversionBoxes()} {/* 박스 렌더링 함수 호출 */}

        </div>
    );
}

export default Exchange;
