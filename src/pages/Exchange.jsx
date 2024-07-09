import React, { useState, useEffect } from 'react';
import '../css/Exchange.css'; // Exchange 컴포넌트에 적용할 스타일 시트를 임포트합니다.
import unitData from "../json/Exchange-unit.json"; // 환율 데이터가 포함된 JSON 파일을 임포트합니다.

function Exchange() {
    const [curr, setCurr] = useState(''); // 선택된 첫 번째 통화를 저장하는 상태
    const [checkedSecondCurrencies, setCheckedSecondCurrencies] = useState([]); // 두 번째 통화 선택 항목을 저장하는 상태
    const [amount, setAmount] = useState(''); // 입력된 금액을 저장하는 상태
    const [boxStates, setBoxStates] = useState([ // 각 박스의 상태를 저장하는 배열
        {
            toCurr: '',
            currRate: '',
            convertedAmount: ''
        }
    ]);
    const [currList, setCurrList] = useState([
        {
            toCurr: '',
            currRate: '',
        }
    ]);

    // API에서 환율 데이터를 가져오는 함수
    const fetchExchangeRate = async (baseCurrency) => {
        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/e823bddd368a1b486559f227/latest/${baseCurrency}`);
            if (!response.ok) {
                throw new Error('API 호출 실패');
            }
            const data = await response.json();
            return data.conversion_rates;
        } catch (error) {
            console.error('API 호출 에러:', error);
            return {};
        }
    };

    // 드롭다운에 표시할 첫 번째 통화 선택 항목 렌더링
    const renderMainCurrencyRadio = () => {
        return Object.keys(unitData).map(currency => (
            <div key={currency}>
                <input
                    type="radio"
                    id={`main-${currency}`}
                    checked={curr === currency}
                    onChange={() => handleMainCurrencyChange(currency)}
                />
                <label htmlFor={`main-${currency}`}>{unitData[currency].cur}</label>
            </div>
        ));
    };

    // 첫 번째 통화 선택 항목을 클릭했을 때 호출되는 함수
    const handleMainCurrencyChange = async (newMainCurrency) => {
        setCurr(newMainCurrency);
    };

    // 드롭다운에 표시할 두 번째 통화 선택 항목 렌더링
    const renderConversionCurrencyCheckboxes = () => {
        return Object.keys(unitData).map(currency => (
            <div key={currency}>
                <input
                    type="checkbox"
                    id={`conversion-${currency}`}
                    checked={checkedSecondCurrencies.includes(currency)}
                    onChange={(e) => handleConversionCurrencyChange(currency, e.target.checked)}
                />
                <label htmlFor={`conversion-${currency}`}>{unitData[currency].cur}</label>
            </div>
        ));
    };

    // 두 번째 통화 선택 항목을 클릭했을 때 호출되는 함수
    const handleConversionCurrencyChange = async (currency, isChecked) => {
        if (isChecked) {
            setCheckedSecondCurrencies(prev => [...prev, currency]);
        } else {
            setCheckedSecondCurrencies(prev => prev.filter(curr => curr !== currency));
        }
    };

   // useEffect를 사용하여 checkedSecondCurrencies가 업데이트 될 때 currList를 업데이트
    useEffect(() => {
        const fetchData = async () => {
            if (curr !== '') {
                const rates = await fetchExchangeRate(curr);
                setCurrList(checkedSecondCurrencies.map(currency => ({
                    toCurr: currency,
                    currRate: rates[currency],
                })));
            }
        };

        fetchData();
    }, [checkedSecondCurrencies, curr]);

    useEffect(() => {
        if (curr !== '') {
            const newBoxStates = checkedSecondCurrencies.map(currency => {
                const foundItem = currList.find(item => item.toCurr === currency);
                const currRate = foundItem ? foundItem.currRate : '0'; // 기본값 설정
                const convertedAmount = parseFloat(amount) * parseFloat(currRate || 0); // currRate가 숫자가 아니면 기본값 0 사용

                return {
                    toCurr: currency,
                    currRate: currRate,
                    convertedAmount: isNaN(convertedAmount) ? '0' : convertedAmount.toFixed(3), // 변환된 금액이 NaN일 경우 'N/A' 처리
                };
            });
            setBoxStates(newBoxStates);
        } else {
            setBoxStates([]);
        }
    }, [amount, currList]);

    // 첫 번째 입력 필드 값 변경 시 호출되는 함수
    const handleAmountChange = (e) => {
        let inputAmount = e.target.value;

        // 숫자가 아닌 입력 값 제거
        if (!/^\d*\.?\d*$/.test(inputAmount)) {
            return;
        }

        // 앞에 0이 올 수 없게 처리
        if (inputAmount.startsWith('0') && inputAmount.length > 1 && !inputAmount.startsWith('0.')) {
            inputAmount = inputAmount.replace(/^0+/, '');
        }

        setAmount(inputAmount);
    };

    // 두 번째 입력 필드 값 변경 시 호출되는 함수
    const handleConvertedAmountChange = (e, boxIndex) => {
        // const inputConvertedAmount = e.target.value; // 입력된 값 가져오기
        // const newBoxStates = [...boxStates];
        // newBoxStates[boxIndex].convertedAmount = inputConvertedAmount; // 변환된 금액 상태 업데이트
        // setBoxStates(newBoxStates);
        // if (curr && newBoxStates[boxIndex].toCurr) {
        //     const rate = parseFloat(currList.find(item => item.toCurr === newBoxStates[boxIndex].toCurr)?.currRate || 0); // 선택된 통화 간의 역환율 가져오기
        //     setAmount((parseFloat(inputConvertedAmount) / rate || 0).toFixed(3)); // 첫 번째 입력 필드에 반대로 계산된 금액 상태 업데이트
        // }
    };

    // 박스 렌더링을 위한 함수
    const renderConversionBoxes = () => {
        return boxStates.map((box, index) => (
            <div className="main-class" key={index}>
                <div className="dropdown">
                    <button className="dropbtn">
                        {curr ? unitData[box.toCurr]?.cur : ''}
                        <div className="inner-value">[{currList.find(item => item.toCurr === box.toCurr)?.currRate}]</div>
                    </button>
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
                        {formatNumber(box.convertedAmount || '')} {curr ? unitData[box.toCurr]?.unit : ''}
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
                    {renderMainCurrencyRadio()}
                </div>

                <div className="checklist">
                    <h3>계산 화폐</h3>
                    {renderConversionCurrencyCheckboxes()}
                </div>
            </div>

            <div className="main-class">
                <div className="dropdown">
                    <button className="dropbtn">{curr ? unitData[curr]?.cur : ''}</button>
                </div>


                <div>
                    <input
                        className="input-area"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                    <div className={"bottom-div"}>{formatNumber(amount)} {curr ? unitData[curr]?.unit : '' || ''}</div>
                    {/* 입력된 금액을 포맷팅하여 표시 */}
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
