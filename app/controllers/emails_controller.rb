class EmailsController < ApplicationController
  def index
    @emails = Email.all.order(created_at: :desc)
    @selected_email = nil
  end

  def create
    @email = Email.create(
      object: Faker::Lorem.sentence(word_count: 5),
      body: Faker::Lorem.paragraph(sentence_count: 5),
      is_read: false
    )

    @emails = Email.all.order(created_at: :desc)

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace("emails", partial: "shared/emails_list", locals: { emails: @emails })
      end
      format.html { redirect_to emails_path }
    end
  end

  def show
    @email = Email.find(params[:id])
    @email.update(is_read: true)
    @emails = Email.all.order(created_at: :desc)
    @selected_email = @email

    # Si c'est une requête Turbo Frame, on répond toujours avec Turbo Stream
    if turbo_frame_request?
      render turbo_stream: [
        turbo_stream.replace("emails", partial: "shared/emails_list", locals: { emails: @emails }),
        turbo_stream.replace("selected_email", partial: "shared/selected_email", locals: { selected_email: @selected_email })
      ]
    else
      render :index
    end
  end

  def destroy
    @email = Email.find(params[:id])
    @email.destroy
    
    # Optimisation : on recharge la liste immédiatement après suppression
    @emails = Email.all.order(created_at: :desc)
    
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("emails", partial: "shared/emails_list", locals: { emails: @emails }),
          turbo_stream.replace("selected_email", partial: "shared/selected_email", locals: { selected_email: nil })
        ]
      end
      format.html { redirect_to emails_path }
    end
  end

  def mark_as_unread
    @email = Email.find(params[:id])
    @email.update!(is_read: false)  # Utilise update! pour forcer l'écriture immédiate
    
    # Optimisation : on recharge la liste immédiatement après mise à jour
    @emails = Email.all.order(created_at: :desc)
    @selected_email = @email.reload  # Force le rechargement de l'objet

    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.replace("emails", partial: "shared/emails_list", locals: { emails: @emails }),
          turbo_stream.replace("selected_email", partial: "shared/selected_email", locals: { selected_email: @selected_email })
        ]
      end
      format.html { redirect_to emails_path }
    end
  end
end
