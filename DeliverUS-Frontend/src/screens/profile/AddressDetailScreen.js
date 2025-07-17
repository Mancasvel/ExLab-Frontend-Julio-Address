import React from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Switch  } from 'react-native' //NOTESE EL USO DE SWITCH
import { Formik } from 'formik'
import * as yup from 'yup'
import InputItem from '../../components/InputItem'
import TextSemibold from '../../components/TextSemibold'
import { addAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryTap, brandSuccessDisabled } from '../../styles/GlobalStyles'

const validationSchema = yup.object().shape({
// TODO
})
//TODO

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isValid, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            TODO
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  toggleContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginTop: 20,
 },
 toggleLabel: {
   fontSize: 16,
 },
})
