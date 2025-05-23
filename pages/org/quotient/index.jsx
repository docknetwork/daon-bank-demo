import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from 'lib/zodSchemas';
import { toast } from 'sonner';
import { Separator } from 'components/ui/separator';
import { PROOFT_TEMPLATES_IDS } from 'utils/constants';
import { createBankIdCredential } from '_credentials/quotient';
import { createCreditScoreCredential } from '_credentials/equinet';
import { useLocalStorage } from 'hooks/hooks';
import { issueRevokableCredential } from 'utils/issue-crendentials';
import Head from 'next/head';
import userStore from 'store/appStore';
import qrCodeStore from 'store/qrCodeStore';
import LoadingModal from 'components/org/quotient/loading-modal';
import Header from 'components/org/quotient/Header';
import QuotientSuccess from 'components/org/quotient/quotient-success';
import DEFAULT_BANK_FORM_VALUES from 'data/bankFormValues';
import { getRandomNumber } from 'utils';
import { CheckCircle2 } from 'lucide-react';

/**
 * @description Quotient Form to create new bank account.
 * @todo refactor this page by making code more modularTake
 * @returns React.FC page
 */
const QuotientBankForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const proofTemplateId = PROOFT_TEMPLATES_IDS.BIOMETRIC_VERIFICATION;
  const verified = qrCodeStore((state) => state.verified);
  const setVerified = qrCodeStore((state) => state.setVerified);
  const retrievedData = qrCodeStore((state) => state.retrievedData);
  const receiverDid = userStore((state) => state.Did);
  const recipientEmail = userStore((state) => state.userEmail);
  const [showSuccess, setShowSuccess] = useState(false);

  const [revokableCredential, setRevokableCredential] = useLocalStorage('revokableCredential', '');

  const form = useForm({
    resolver: zodResolver(UserSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: DEFAULT_BANK_FORM_VALUES,
  });

  const credentialPayload = {
    receiverDid,
    recipientEmail,
    creditScore: getRandomNumber(700, 800)
  };

  const quotientPayload = () => ({
    receiverDid,
    recipientEmail,
    receiverName: `${form.getValues('firstName')} ${form.getValues('lastName')}`,
    receiverAddress: {
      address: form.getValues('streetAddress'),
      city: form.getValues('city'),
      zip: form.getValues('zipCode'),
      state: form.getValues('state'),
    },
    biometricData: getBiometricalData()
  });

  function getBiometricalData() {
    if (retrievedData !== null) {
      const credential = retrievedData.credentials.find((obj) => Object.prototype.hasOwnProperty.call(obj.credentialSubject, 'biometric_enrollment_id'));
      if (credential) {
        return {
          id: credential.credentialSubject.biometric_enrollment_id,
          created: credential.issuanceDate,
        };
      }
    }
    return null;
  }

  const createCredential = async (credential, payload, isRevocable) => {
    const credentialObj = credential(payload);
    await issueRevokableCredential(credentialObj.body, setRevokableCredential, isRevocable);
  };

  async function issueCredentials() {
    toast.info('Issuing Credentials.');
    const quotient_Payload = quotientPayload();

    console.log('quotient_Payload:', quotient_Payload);
    if (quotient_Payload.biometricData === null) {
      toast.error('Biometrical proof missing property biometrical data. Biometrical data is required to create new credentials.');
      return;
    }

    await createCredential(createBankIdCredential, quotient_Payload, false);
    await createCredential(createCreditScoreCredential, credentialPayload, true);

    toast.info('Credentials issued successfully.');
    setShowSuccess(true);
  }

  useEffect(() => () => {
    setVerified(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (verified === true) {
      console.log('issuing credentials...');
      setTimeout(() => {
        issueCredentials();
      }, 1000);
    }
    // eslint-disable-next-line
  }, [verified]);


  return (
    <>
      <Head>
        <title>Quotient - Open New Bank Account</title>
      </Head>
      <Header />
      <LoadingModal isLoading={isLoading} setIsLoading={setIsLoading} />
      <div className='mainContainer'>
          {
            showSuccess ? (
              <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                <div className='bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-xl w-full'>
                  <CheckCircle2 className='w-16 h-16 text-green-500 mb-4' />
                  <h2 className='text-2xl font-bold mb-2 text-center'>Verification Successful!</h2>
                  <p className='text-base text-center mb-4 text-gray-700'>Your identity has been verified and your new bank account is ready.</p>
                  <Separator className='my-4' />
                  <p className='font-semibold text-center mb-2'>We&apos;ve sent you a <span className='text-blue-700'>Quotient Bank Identity Credential</span> and a <span className='text-blue-700'>EquiNet - Credit Score</span> credential.</p>
                  <p className='text-sm text-center text-gray-600 mb-6'>Credentials should arrive in your wallet in a few seconds.</p>
                </div>
              </div>
            ) : (
            <QuotientSuccess
              title={'Open New Banking Account'}
              proofTemplateId={proofTemplateId} />
            )
          }
      </div>
    </>
  );
};

export default QuotientBankForm;
