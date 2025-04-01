
import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    content: 'I love the convenience of Klin Ride! They come to my office during work hours and I return to a spotless car. The team is professional and thorough.',
    rating: 5
  },
  {
    name: 'Michael Kakooza',
    role: 'Business Owner',
    content: 'Having a fleet of company vehicles, I needed a reliable service to keep them clean. Klin Ride has been exceptional - always on time and delivering quality results.',
    rating: 5
  },
  {
    name: 'Patricia Nambi',
    role: 'Busy Parent',
    content: 'As a parent with a packed schedule, finding time to wash my car was impossible. Klin Ride has been a game-changer. They come to my home and do an amazing job!',
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle">
          Don't just take our word for it. Here's what customers have to say about their Klin Ride experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 card-hover">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="italic text-gray-600 mb-4">"{testimonial.content}"</p>
              <div className="mt-auto">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
