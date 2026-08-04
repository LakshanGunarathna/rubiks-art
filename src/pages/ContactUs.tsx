import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPaperPlane, faCheckCircle, faComments, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { updateMetaTags } from '../utils/seo';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    updateMetaTags(
      "Contact Us - Rubik's Art",
      "Get in touch with the Rubik's Art team for inquiries, bug reports, feature requests, or collaboration opportunities."
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/contact@rubiks-art.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: `[Rubik's Art] ${formData.subject} - from ${formData.name}`,
          category: formData.subject,
          message: formData.message,
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Failed to submit form.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setErrorMessage('Could not send email automatically. Please try again or email us directly at contact@rubiks-art.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Have a question, feedback on our 3D cube solvers, or a feature suggestion for our mosaic generator? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="rounded-3xl p-6 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg space-y-6">
              <h2 className="text-xl font-bold font-heading flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                <FontAwesomeIcon icon={faComments} className="text-emerald-500" />
                Contact Information
              </h2>
              
              <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[var(--text-primary)]">Email Us</h3>
                    <p><a href="mailto:contact@rubiks-art.com" className="hover:text-blue-500 transition-colors">contact@rubiks-art.com</a></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback & Comments Note */}
            <div className="rounded-3xl p-6 backdrop-blur-md border border-emerald-500/20 bg-emerald-500/5 text-left space-y-3">
              <h3 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm">
                <FontAwesomeIcon icon={faComments} />
                We Value Your Feedback!
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Feel free to share your feedback, comments, feature ideas, or suggestions to help us improve Rubik's Art for everyone.
              </p>
            </div>

          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-2 rounded-3xl p-6 sm:p-8 backdrop-blur-md border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-xl">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <h2 className="text-2xl font-bold font-heading" style={{ color: 'var(--text-primary)' }}>
                  Message Sent Successfully!
                </h2>
                <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Thank you for contacting us, <strong>{formData.name}</strong>. Your message has been sent to <strong>contact@rubiks-art.com</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-sm shadow-md cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold font-heading mb-4" style={{ color: 'var(--text-primary)' }}>
                  Send Us a Message
                </h2>

                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-3">
                    <FontAwesomeIcon icon={faExclamationCircle} className="text-lg flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Smith"
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--glass-border)] bg-slate-500/5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      className="w-full px-4 py-3 rounded-2xl border border-[var(--glass-border)] bg-slate-500/5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--glass-border)] bg-slate-500/5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bug Report">Bug Report / Technical Issue</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Mosaic Customization">Mosaic Generator Support</option>
                    <option value="Partnership / Advertising">Partnership / Advertising</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--glass-border)] bg-slate-500/5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};
