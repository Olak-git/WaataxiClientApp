import React, { useCallback, useEffect, useRef, useState } from 'react';
import Base from '../../../components/Base';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Email from './components/Email';
import VerifCode from './components/VerifCode';
import Password from './components/Password';

interface ResetPasswordViewProps {
    navigation: any,
    route: any
}
const ResetPasswordView:React.FC<ResetPasswordViewProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const user = useSelector((state: any) => state.user.data);

    const pin_count = 5

    const [inputs, setInputs] = useState({
      email: '',
      code: null,
      tel: route.params.tel
    });

    const [errors, setErrors] = useState({
      email: null,
      code: null
    });

    const [confirm, setConfirm] = useState<any>(false);

    const handleOnChange = (input: string, text: any) => {
      setInputs(prevState => ({ ...prevState, [input]: text }))
    }

    const handleError = (input: string, text: any) => {
      setErrors(prevState => ({...prevState, [input]: text}))
    }

    const goDashboard = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Drawer'}
                ]
            })
        )
    }

    useEffect(() => {
        if(Object.keys(user).length > 0) {
            goDashboard();
        }
    }, [user]);

    return (
        <Base>
            {confirm
              ? <Password setConfirm={setConfirm} email={inputs.email} tel={inputs.tel} /> 
              : inputs.code 
                ? <VerifCode inputs={inputs} handleOnChange={handleOnChange} pin_count={pin_count} setConfirm={setConfirm} />
                : <Email inputs={inputs} errors={errors} handleOnChange={handleOnChange} handleError={handleError} pin_count={pin_count} />
            }
        </Base>
    )
}

export default ResetPasswordView;