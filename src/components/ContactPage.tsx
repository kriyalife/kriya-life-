import React, { useState } from 'react';
import { getFormspreeEndpoint } from '../lib/formspree';
import { supabase } from '../lib/supabaseClient';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Send submission to Formspree endpoint
      try {
        await fetch(getFormspreeEndpoint(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            _subject: 'New Contact Form Submission - Kriya Lifescience'
          })
        });
      } catch (fErr) {
        console.warn('Formspree submission notice:', fErr);
      }

      try {
        const { error: insertError } = await supabase.from('contacts').insert([
          {
            name: name.trim(),
            email: email.trim(),
            message: message.trim()
          }
        ]);
        if (insertError) {
          console.warn('Supabase contact insert warning:', insertError);
        }
      } catch (sErr) {
        console.warn('Supabase contact insert exception:', sErr);
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2217] text-white px-6 py-16">
      
      <h1 className="text-4xl sm:text-5xl font-medium text-center text-white mb-4 font-serif tracking-tight">
        Contact Us
      </h1>

      <p className="text-center text-emerald-100/70 mb-12 max-w-2xl mx-auto font-light text-sm sm:text-base leading-relaxed">
        Have questions or need assistance? Our team at KRIYA Lifescience is here to help. Feel free to reach out to us through any of the contact details below.
      </p>

      <div className="max-w-3xl mx-auto bg-stone-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/15">
        
        {/* Phone */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-emerald-400 font-serif mb-2 flex items-center gap-2">
            <span>📞</span> Phone
          </h2>
          <p className="text-white/90 font-medium mb-1">+91 7405500454</p>
          <p className="text-white/90 font-medium">+91 7874867191</p>
        </div>

        {/* Email */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-emerald-400 font-serif mb-2 flex items-center gap-2">
            <span>📧</span> Email
          </h2>
          <p className="text-white/90">
            <a href="mailto:kriyalifescince@gmail.com" className="text-emerald-300 hover:text-white transition-colors underline underline-offset-4">
              kriyalifescince@gmail.com
            </a>
          </p>
        </div>

        {/* Address */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-emerald-400 font-serif mb-2 flex items-center gap-2">
            <span>📍</span> Address
          </h2>
          <p className="text-emerald-100/80 leading-relaxed text-sm">
            216, Silver Empire,<br />
            VIP Circle to Utran Road,<br />
            Mota Varachha, Surat,<br />
            Gujarat – 394101, India
          </p>
        </div>

        {/* Contact Form */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <h2 className="text-xl font-semibold text-white font-serif mb-6">Send Message</h2>

          {success && (
            <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Thank you! Your message has been sent successfully. We will get back to you soon.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 transition-all text-sm bg-stone-950 text-white placeholder-white/40"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border border-white/20 rounded-xl focus:outline-none focus:border-emerald-400 transition-all text-sm bg-stone-950 text-white placeholder-white/40"
            />

            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full p-4 border border-white/20 rounded-xl h-36 focus:outline-none focus:border-emerald-400 transition-all text-sm bg-stone-950 text-white placeholder-white/40 resize-none"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 text-stone-950 font-extrabold py-4 px-6 rounded-full hover:bg-emerald-400 transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-stone-950" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
