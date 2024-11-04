import emailjs from '@emailjs/browser';

emailjs.init('YOUR_PUBLIC_KEY');

export const sendEmail = async (templateParams: Record<string, unknown>) => {
  try {
    const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
    return response;
  } catch (error) {
    throw error;
  }
};
