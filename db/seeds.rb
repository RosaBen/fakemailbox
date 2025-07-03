require 'faker'
puts "🔄 Réinitialisation des emails..."
Email.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!('emails')
puts "✅ Emails supprimés."
10.times do
  Email.create(
    object: Faker::Lorem.sentence(word_count: 3),
    body: Faker::Lorem.paragraph(sentence_count: 2)
  )
end
puts "📩 10 nouveaux emails créés."
