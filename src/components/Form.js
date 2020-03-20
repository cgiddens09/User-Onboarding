import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

const UserForm = ({ values, touched, errors, status }) => {
    const [user, setUser] = useState([]);

    useEffect(() => {
      status && setUser(user => [...user, status]);
    }, [status]);

    return (
        <div>
          <h1>User Onboarding!</h1>
          <div>
            <Form>
              <br /> <br />
              <label htmlFor="name">Enter Your Name: </label>
              <Field type='text' name='name' placeholder='Name:' />
              {touched.name && errors.name && (
                <p>{errors.name}</p>
              )} <br />
              <label htmlFor="email">Enter Your Email: </label>
              <Field type='email' name='email' placeholder='Email:' />
              {touched.email && errors.email && (
                <p>{errors.email}</p>
              )} <br />
              <label htmlFor="password">Create Password: </label>
              <Field type='password' name='password' placeholder='Password:' />
              {touched.password && errors.password && (
                <p>{errors.password}</p>
              )} <br />
              <label htmlFor="Terms of Service">Agree to Terms?</label>
              <Field
                type='checkbox'
                checked={values.TermsOfService}
                name='TermsOfService'
                required
              />
              <button type='submit' disabled={values.isSubmitting}>
                {values.isSubmitting ? 'Submitting' : 'Submit'}
              </button>
            </Form>
          </div>
          <div>
            {user.map(user => (
              <div>
                <h3>Name: {user.name}</h3>
                <p>Email: {user.email}</p>
              </div>
            ))}
            
          </div>
        </div>
      );
    };

    export default withFormik({
        mapPropsToValues: props => ({
          name: '',
          email: '',
          password: '',
          TermsOfService: false
        }),
        validationSchema: Yup.object().shape({
          name: Yup.string()
            .min(2, 'Too Short!')
            .max(70, 'Too Long!')
            .required('Name is Required!'),
          email: Yup.string()
            .min(5, 'Too Short!')
            .max(50, 'Too Long!')
            .email('Invalid email')
            .required('Email is Required!'),
          password: Yup.string()
            .min(6, 'Too Short!')
            .max(15, 'Too Long!')
            .required('Password is Required'),
          TermsOfService: Yup.boolean().oneOf([true], "Please check box.")
        }),
        handleSubmit: (values, { resetForm, setStatus }) => {
          axios
            .post('https://reqres.in/api/users', values)
            .then(response => {
              console.log('value', values);
              setStatus(response.data);
              resetForm();
              
            })
            .catch(err => console.log(err.response));
        }
      })(UserForm);