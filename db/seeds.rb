require 'faker'
# create 10 emails with random data
10.times do
  Email.create(
    object: Faker::Lorem.sentence(word_count: 3),
    body: Faker::Lorem.paragraph(sentence_count: 2)
  )
end