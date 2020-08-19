<?php

namespace app\modules\api\v1\models;

use Yii;

/**
 * This is the model class for table "clients".
 *
 * @property int $client_id Идентификатор таблицы
 * @property string $surname Фамилия
 * @property string $name Имя
 * @property string $mobile_phone Номер мобильного телефона
 * @property string $email Имя почтового ящика
 * @property int $sys_client_type_id Тип клиента - Ссылка на ИД таблицы SYS_CLIENT_TYPES
 * @property string $end_date Дата окончания (учебы, работы и тд.)
 * @property string $start_date Дата начала (учебы, работы и тд.)
 * @property string $birth_date Дата рождения
 * @property int $document_type_id Тип документа - Ссылка на ИД таблицы DOCUMENT_TYPES
 * @property string $document Номер документа
 * @property int $sex Пол
 * @property int $bcity_id Город рождения - Ссылка на ИД таблицы TERRITORIES
 * @property int $nationality_id Национальность - Ссылка на ИД таблицы NATIONALITIES
 * @property string $address Адрес
 * @property int $city_id Город (проживания, пребывания) - Ссылка на ИД таблицы TERRITORIES
 * @property string $postal_code Почтовый индекс
 * @property string $phone Дополнительный номер телефона
 * @property string $father_name Имя отца
 * @property string $father_surname Фамилия отца
 * @property string $father_phone Контактный телефон отца
 * @property string $father_email Контактый email отца
 * @property string $mother_name Имя матери
 * @property string $mother_surname Фамилия матери
 * @property string $mother_phone Контактный телефон матери
 * @property string $mother_email Контактый email матери
 * @property string $photo Фото контакта
 * @property string $comment Комментарий
 * @property int $sys_sex_id Пол - Ссылка на ИД таблицы SYS_SEX
 * @property int $sys_type_person_id Физ или юр лицо - Ссылка на ИД таблицы SYS_TYPE_PERSON
 * @property int $leader_id Руководитель - Ссылка на ИД таблицы CLIENTS
 * @property int $present_post_id Занимаемая должность - Ссылка на ИД таблицы PRESENT_POSTS
 * @property int $sys_country_id Страна - Ссылка на ИД таблицы SYS_COUNTRIES
 * @property int $sys_bcountry_id Страна рождения - Ссылка на ИД таблицы SYS_COUNTRIES
 * @property int $manager_id Менеджер - Ссылка на ИД таблицы CLIENTS
 * @property int $status_id Статус - Ссылка на ИД таблицы STATUSES
 * @property int $involve_source_id Источник привлечения - Ссылка на ИД таблицы INVOLVE_SOURCES
 * @property int $company_id Компания - Ссылка на ИД таблицы COMPANIES
 * @property string $company_name Наименование компании
 * @property string $website Вебсайт компании
 * @property string $inn ИНН
 * @property string $ogrn ОГРН
 * @property string $kpp КПП
 * @property string $okpo ОКПО
 * @property string $checking_account Расчетный счет
 * @property string $bank Банк
 * @property string $bik БИК
 * @property string $correspondent_account Корреспондентский счет
 * @property int $user_id ИД пользователя
 *
 * @property ScheduleWorkYear[] $scheduleWorkYears
 * @property StatusHistory[] $statusHistories
 * @property SysCountries $sysCountry
 * @property SysTypePerson $sysTypePerson
 * @property SysCountries $sysBcountry
 * @property Territories $bcity
 * @property Territories $city
 * @property DocumentTypes $documentType
 * @property Lead $leader
 * @property Lead[] $leads
 * @property Nationalities $nationality
 * @property PresentPosts $presentPost
 * @property SysSex $sysSex
 * @property Companies $company
 * @property Lead $manager
 * @property Lead[] $leads0
 * @property Statuses $status
 * @property InvolveSources $involveSource
 * @property SysClientTypes $sysClientType
 * @property ScheduleWork[] $scheduleWorks
 * @property ClientPerDiscipline[] $clientPerDisciplines
 * @property ClientPerBranch[] $clientPerBranches
 * @property Classes[] $classes
 * @property ScheduleRules[] $scheduleRules
 * @property GroupPerClient[] $groupPerClients
 * @property Groups[] $groups
 * @property ClientPerTag[] $clientPerTags
 * @property ScheduleEventPerClient[] $scheduleEventPerClients
 * @property ClientPerLang[] $clientPerLangs
 * @property Langs[] $langs
 * @property Groups[] $groups0
 * @property ScheduleEvents[] $scheduleEvents
 * @property Agents[] $agents
 * @property Agents[] $agents0
 * @property Requests[] $requests
 * @property Requests[] $requests0
 * @property Demands[] $demands
 * @property Schedules[] $schedules
 * @property Accounts[] $accounts
 * @property Accounts[] $accounts0
 * @property Payments[] $payments
 * @property Payments[] $payments0
 * @property CompanyPerDirectors[] $companyPerDirectors
 * @property SchedulerPerClient[] $schedulerPerClients
 * @property Curriculums[] $curriculums
 * @property TimeSheets[] $timeSheets
 * @property Documents[] $documents
 * @property ClassPerStudents[] $classPerStudents
 * @property TblUsers[] $tblUsers
 * @property NotificationPerClient[] $notificationPerClients
 * @property Notifications[] $notifications
 * @property ClassPerChange[] $classPerChanges
 * @property ClientPerDocument[] $clientPerDocuments
 * @property RequestGroups[] $requestGroups
 * @property RequestGroupClients[] $requestGroupClients
 */
class Lead extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'clients';
    }

    /**
     * @return \yii\db\Connection the database connection used by this AR class.
     */
    public static function getDb()
    {
        return Yii::$app->get('datadb');
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['sys_client_type_id', 'document_type_id', 'sex', 'bcity_id', 'nationality_id', 'city_id', 'sys_sex_id', 'sys_type_person_id', 'leader_id', 'present_post_id', 'sys_country_id', 'sys_bcountry_id', 'manager_id', 'status_id', 'involve_source_id', 'company_id', 'user_id'], 'integer'],
            [['end_date', 'start_date', 'birth_date'], 'string'],
            [['surname', 'name', 'father_surname', 'mother_surname', 'bank'], 'string', 'max' => 255],
            [['mobile_phone', 'document', 'postal_code', 'phone', 'father_phone', 'mother_phone', 'inn', 'ogrn', 'kpp', 'okpo', 'checking_account', 'bik', 'correspondent_account'], 'string', 'max' => 25],
            [['email', 'father_name', 'father_email', 'mother_name', 'mother_email'], 'string', 'max' => 50],
            [['address', 'photo', 'website'], 'string', 'max' => 1024],
            [['comment', 'company_name'], 'string', 'max' => 4096],
            /*
            [['sys_country_id'], 'exist', 'skipOnError' => true, 'targetClass' => SysCountries::className(), 'targetAttribute' => ['sys_country_id' => 'sys_country_id']],
            [['sys_type_person_id'], 'exist', 'skipOnError' => true, 'targetClass' => SysTypePerson::className(), 'targetAttribute' => ['sys_type_person_id' => 'sys_type_person_id']],
            [['sys_bcountry_id'], 'exist', 'skipOnError' => true, 'targetClass' => SysCountries::className(), 'targetAttribute' => ['sys_bcountry_id' => 'sys_country_id']],
            [['bcity_id'], 'exist', 'skipOnError' => true, 'targetClass' => Territories::className(), 'targetAttribute' => ['bcity_id' => 't_id']],
            [['city_id'], 'exist', 'skipOnError' => true, 'targetClass' => Territories::className(), 'targetAttribute' => ['city_id' => 't_id']],
            [['document_type_id'], 'exist', 'skipOnError' => true, 'targetClass' => DocumentTypes::className(), 'targetAttribute' => ['document_type_id' => 'document_type_id']],
            [['leader_id'], 'exist', 'skipOnError' => true, 'targetClass' => Lead::className(), 'targetAttribute' => ['leader_id' => 'client_id']],
            [['nationality_id'], 'exist', 'skipOnError' => true, 'targetClass' => Nationalities::className(), 'targetAttribute' => ['nationality_id' => 'nationality_id']],
            [['present_post_id'], 'exist', 'skipOnError' => true, 'targetClass' => PresentPosts::className(), 'targetAttribute' => ['present_post_id' => 'present_post_id']],
            [['sys_sex_id'], 'exist', 'skipOnError' => true, 'targetClass' => SysSex::className(), 'targetAttribute' => ['sys_sex_id' => 'sys_sex_id']],
            [['company_id'], 'exist', 'skipOnError' => true, 'targetClass' => Companies::className(), 'targetAttribute' => ['company_id' => 'company_id']],
            [['manager_id'], 'exist', 'skipOnError' => true, 'targetClass' => Lead::className(), 'targetAttribute' => ['manager_id' => 'client_id']],
            [['status_id'], 'exist', 'skipOnError' => true, 'targetClass' => Statuses::className(), 'targetAttribute' => ['status_id' => 'status_id']],
            [['involve_source_id'], 'exist', 'skipOnError' => true, 'targetClass' => InvolveSources::className(), 'targetAttribute' => ['involve_source_id' => 'involve_source_id']],
            [['sys_client_type_id'], 'exist', 'skipOnError' => true, 'targetClass' => SysClientTypes::className(), 'targetAttribute' => ['sys_client_type_id' => 'sys_client_type_id']],
            */
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'client_id' => 'Client ID',
            'surname' => 'Surname',
            'name' => 'Name',
            'mobile_phone' => 'Mobile Phone',
            'email' => 'Email',
            'sys_client_type_id' => 'Sys Client Type ID',
            'end_date' => 'End Date',
            'start_date' => 'Start Date',
            'birth_date' => 'Birth Date',
            'document_type_id' => 'Document Type ID',
            'document' => 'Document',
            'sex' => 'Sex',
            'bcity_id' => 'Bcity ID',
            'nationality_id' => 'Nationality ID',
            'address' => 'Address',
            'city_id' => 'City ID',
            'postal_code' => 'Postal Code',
            'phone' => 'Phone',
            'father_name' => 'Father Name',
            'father_surname' => 'Father Surname',
            'father_phone' => 'Father Phone',
            'father_email' => 'Father Email',
            'mother_name' => 'Mother Name',
            'mother_surname' => 'Mother Surname',
            'mother_phone' => 'Mother Phone',
            'mother_email' => 'Mother Email',
            'photo' => 'Photo',
            'comment' => 'Comment',
            'sys_sex_id' => 'Sys Sex ID',
            'sys_type_person_id' => 'Sys Type Person ID',
            'leader_id' => 'Leader ID',
            'present_post_id' => 'Present Post ID',
            'sys_country_id' => 'Sys Country ID',
            'sys_bcountry_id' => 'Sys Bcountry ID',
            'manager_id' => 'Manager ID',
            'status_id' => 'Status ID',
            'involve_source_id' => 'Involve Source ID',
            'company_id' => 'Company ID',
            'company_name' => 'Company Name',
            'website' => 'Website',
            'inn' => 'Inn',
            'ogrn' => 'Ogrn',
            'kpp' => 'Kpp',
            'okpo' => 'Okpo',
            'checking_account' => 'Checking Account',
            'bank' => 'Bank',
            'bik' => 'Bik',
            'correspondent_account' => 'Correspondent Account',
            'user_id' => 'User ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getScheduleWorkYears()
    {
        return $this->hasMany(ScheduleWorkYear::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getStatusHistories()
    {
        return $this->hasMany(StatusHistory::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSysCountry()
    {
        return $this->hasOne(SysCountries::className(), ['sys_country_id' => 'sys_country_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSysTypePerson()
    {
        return $this->hasOne(SysTypePerson::className(), ['sys_type_person_id' => 'sys_type_person_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSysBcountry()
    {
        return $this->hasOne(SysCountries::className(), ['sys_country_id' => 'sys_bcountry_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBcity()
    {
        return $this->hasOne(Territories::className(), ['t_id' => 'bcity_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCity()
    {
        return $this->hasOne(Territories::className(), ['t_id' => 'city_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDocumentType()
    {
        return $this->hasOne(DocumentTypes::className(), ['document_type_id' => 'document_type_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLeader()
    {
        return $this->hasOne(Lead::className(), ['client_id' => 'leader_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLeads()
    {
        return $this->hasMany(Lead::className(), ['leader_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getNationality()
    {
        return $this->hasOne(Nationalities::className(), ['nationality_id' => 'nationality_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPresentPost()
    {
        return $this->hasOne(PresentPosts::className(), ['present_post_id' => 'present_post_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSysSex()
    {
        return $this->hasOne(SysSex::className(), ['sys_sex_id' => 'sys_sex_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCompany()
    {
        return $this->hasOne(Companies::className(), ['company_id' => 'company_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getManager()
    {
        return $this->hasOne(Lead::className(), ['client_id' => 'manager_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLeads0()
    {
        return $this->hasMany(Lead::className(), ['manager_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getStatus()
    {
        return $this->hasOne(Statuses::className(), ['status_id' => 'status_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getInvolveSource()
    {
        return $this->hasOne(InvolveSources::className(), ['involve_source_id' => 'involve_source_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSysClientType()
    {
        return $this->hasOne(SysClientTypes::className(), ['sys_client_type_id' => 'sys_client_type_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getScheduleWorks()
    {
        return $this->hasMany(ScheduleWork::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClientPerDisciplines()
    {
        return $this->hasMany(ClientPerDiscipline::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClientPerBranches()
    {
        return $this->hasMany(ClientPerBranch::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClasses()
    {
        return $this->hasMany(Classes::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getScheduleRules()
    {
        return $this->hasMany(ScheduleRules::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getGroupPerClients()
    {
        return $this->hasMany(GroupPerClient::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getGroups()
    {
        return $this->hasMany(Groups::className(), ['group_id' => 'group_id'])->viaTable('group_per_client', ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClientPerTags()
    {
        return $this->hasMany(ClientPerTag::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getScheduleEventPerClients()
    {
        return $this->hasMany(ScheduleEventPerClient::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClientPerLangs()
    {
        return $this->hasMany(ClientPerLang::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getLangs()
    {
        return $this->hasMany(Langs::className(), ['lang_id' => 'lang_id'])->viaTable('client_per_lang', ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getGroups0()
    {
        return $this->hasMany(Groups::className(), ['curator_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getScheduleEvents()
    {
        return $this->hasMany(ScheduleEvents::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAgents()
    {
        return $this->hasMany(Agents::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAgents0()
    {
        return $this->hasMany(Agents::className(), ['representative_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRequests()
    {
        return $this->hasMany(Requests::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRequests0()
    {
        return $this->hasMany(Requests::className(), ['manager_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDemands()
    {
        return $this->hasMany(Demands::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSchedules()
    {
        return $this->hasMany(Schedules::className(), ['initiator_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAccounts()
    {
        return $this->hasMany(Accounts::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAccounts0()
    {
        return $this->hasMany(Accounts::className(), ['payer_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPayments()
    {
        return $this->hasMany(Payments::className(), ['manager_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPayments0()
    {
        return $this->hasMany(Payments::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCompanyPerDirectors()
    {
        return $this->hasMany(CompanyPerDirectors::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getSchedulerPerClients()
    {
        return $this->hasMany(SchedulerPerClient::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCurriculums()
    {
        return $this->hasMany(Curriculums::className(), ['teacher_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTimeSheets()
    {
        return $this->hasMany(TimeSheets::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getDocuments()
    {
        return $this->hasMany(Documents::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClassPerStudents()
    {
        return $this->hasMany(ClassPerStudents::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getTblUsers()
    {
        return $this->hasMany(TblUsers::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getNotificationPerClients()
    {
        return $this->hasMany(NotificationPerClient::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getNotifications()
    {
        return $this->hasMany(Notifications::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClassPerChanges()
    {
        return $this->hasMany(ClassPerChange::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClientPerDocuments()
    {
        return $this->hasMany(ClientPerDocument::className(), ['client_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRequestGroups()
    {
        return $this->hasMany(RequestGroups::className(), ['teacher_id' => 'client_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getRequestGroupClients()
    {
        return $this->hasMany(RequestGroupClients::className(), ['client_id' => 'client_id']);
    }

}
