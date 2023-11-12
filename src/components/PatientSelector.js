import React, { useState, useEffect } from 'react';
import Select from 'react-select'
const options = [
    { value: 0, label: 'Anderson, Amelia' },
    { value: 1, label: 'Anderson, Jackson' },
    { value: 2, label: 'Brown, Noah' },
    { value: 3, label: 'Garcia, Mia' },
    { value: 4, label: 'Hernandez, Caleb' },
    { value: 5, label: 'Jones, Isabella' },
    { value: 6, label: 'Johnson, Liam' },
    { value: 7, label: 'Martin, Abigail' },
    { value: 8, label: 'Martinez, Sophia' },
    { value: 9, label: 'Miller, Elijah' },
    { value: 10, label: 'Moore, Harper' },
    { value: 11, label: 'Davis, Ethan' },
    { value: 12, label: 'Davis, Emma' },
    { value: 13, label: 'Olivia, Smith' },
    { value: 14, label: 'Oliver, Taylor' },
    { value: 15, label: 'Taylor, Ava' },
    { value: 16, label: 'Taylor, Oliver' },
    { value: 17, label: 'Thompson, Benjamin' },
    { value: 18, label: 'Williams, Evelyn' },
    { value: 19, label: 'Wilson, Aiden' },
  ];
  

  
export default function PatientSelector(props) {

    const changeHandler = e => {
        props.setPatientId(e.value);
    };

    return <Select
        name="patient_id"
        value={options.find(item => item.value === props.patientId)}
        onChange={changeHandler}
        options={options}
    />
}
