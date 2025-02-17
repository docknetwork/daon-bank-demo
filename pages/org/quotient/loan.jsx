import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from 'components/org/quotient/Header';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanSchema } from 'lib/zodSchemas';
import { Form } from 'components/ui/form';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';
import FormFieldCarDetails from 'components/forms/newLoan/form-field-car-details';
import FormFieldNameAndBirthday from 'components/forms/form-field-id';
import FormFieldAddress from 'components/forms/form-field-address';
import FormFieldPersonalContact from 'components/forms/form-field-personal-contact';
import QrCodeAuthentication from 'components/qrcode/qr-auth';
import QuotientSuccess from 'components/org/quotient/quotient-success';
import { PROOFT_TEMPLATES_IDS } from 'utils/constants';
import qrCodeVerificationData from 'data/qrcode-text-data';
import useQrCode from 'hooks/useQrCode';
import qrCodeStore from 'store/qrCodeStore';
import DEFAULT_BANK_FORM_VALUES from 'data/bankFormValues';

const DEFAULT_FORM_VALUES = {
  sellerName: 'Charleswood Toyota Partners',
  newOrUsed: 'Used',
  year: '2022',
  mileage: '45000',
  make: 'Toyota',
  model: 'Celica',
  price: '28999',
  firstName: '',
  lastName: '',
  suffix: '',
  streetAddress: '',
  suite: '15',
  zipCode: '',
  city: '',
  state: '',
  email: DEFAULT_BANK_FORM_VALUES.email,
  phoneNumber: DEFAULT_BANK_FORM_VALUES.phoneNumber,
};

/**
 * @description Quotient Form to apply for a loan.
 * @todo refactor this page by making code more modular
 * @returns React.FC Form Field
 */
const QuotientApplyLoanForm = () => {
  const [applicant, setApplicant] = useState({
    firstName: {
      text: '',
      isVerified: false
    },
    lastName: {
      text: '',
      isVerified: false
    },
    streetAddress: {
      text: '',
      isVerified: false
    },
    city: {
      text: '',
      isVerified: false
    },
    zipCode: {
      text: '',
      isVerified: false
    },
    state: {
      text: '',
      isVerified: false
    },
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const verified = qrCodeStore((state) => state.verified);
  const retrievedData = qrCodeStore((state) => state.retrievedData);

  const form = useForm({
    resolver: zodResolver(LoanSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const proofTemplateId = PROOFT_TEMPLATES_IDS.LOAN_PROOF;
  const proofTemplateCreditScore = PROOFT_TEMPLATES_IDS.URBANSCAPE_CREDITSCORE;

  async function onSubmit(values) {
    toast.info('Form Submitted');
    setIsSuccess(true);
  }

  const { refetch } = useQrCode({ proofTemplateId });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (verified === true) {
      setTimeout(() => {
        if (retrievedData !== null) {
          const credential = retrievedData.credentials.find((obj) => Object.prototype.hasOwnProperty.call(obj.credentialSubject, 'address'));
          if (credential) {
            const username = credential.credentialSubject.name.split(' ');
            setApplicant({
              firstName: {
                text: username[0],
                isVerified: true
              },
              lastName: {
                text: username[1],
                isVerified: true
              },
              streetAddress: {
                text: credential.credentialSubject.address,
                isVerified: true
              },
              city: {
                text: credential.credentialSubject.city,
                isVerified: true
              },
              zipCode: {
                text: credential.credentialSubject.zip,
                isVerified: true
              },
              state: {
                text: credential.credentialSubject.state,
                isVerified: true
              },
            });

            form.setValue('firstName', username[0]);
            form.setValue('lastName', username[1]);
            form.setValue('streetAddress', credential.credentialSubject.address);
            form.setValue('city', credential.credentialSubject.city);
            form.setValue('zipCode', credential.credentialSubject.zip);
            form.setValue('state', credential.credentialSubject.state);
          }
        }
      }, 1000);
    }
    // eslint-disable-next-line
  }, [verified, retrievedData]);

  return (
    <>
      <Head>
        <title>Quotient - Apply Loan</title>
      </Head>
      <Header />
      {isSuccess ? (
        <QuotientSuccess title="Your loan application has been approved!" proofTemplateId={proofTemplateCreditScore} showQrcode={false} />
      ) : (
        <div className='pt-8 p-5 mainContainer'>
          <h2 className='text-2xl font-semibold mb-5'>Apply for Auto Loan</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <div className='flex gap-2 flex-wrap'>
                <div className='p-4 bg-neutral-50 rounded-lg space-y-5 flex-1 flex-1 w-full xl:w-2/3 md:w-2/3'>
                  <FormFieldCarDetails control={form.control} />
                  <Separator />
                  <FormFieldNameAndBirthday control={form.control} applicant={applicant} />
                  <Separator />
                  <FormFieldAddress control={form.control} applicant={applicant} />
                  <Separator />
                  <FormFieldPersonalContact />
                </div>
                <div className='flex-2 w-full md:w-1/3 xl:w-1/3'>
                  <QrCodeAuthentication
                    proofTemplateId={proofTemplateId}
                    title={qrCodeVerificationData.LOAN.title}
                    qrText={qrCodeVerificationData.LOAN.qrText}
                    qrTextAfter={qrCodeVerificationData.LOAN.qrTextAfter}
                  />
                </div>
              </div>
              <div className='mt-4'>
                <Button
                  className="col-span-2 w-fit md:place-self-end px-10 bg-emerald-700 text-lg"
                  type="submit">
                  Submit Application
                </Button>
              </div>
            </form>

          </Form>
        </div>
      )}

    </>
  );
};

export default QuotientApplyLoanForm;
