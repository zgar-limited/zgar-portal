export type GetInventoryListRes = {
    total_page?:        number;
    current_page_size?: number;
    count?:             number;
    page_size?:         number;
    page?:              number;
    rows?:              Row[];
    sum?:               Sum;
}

export type Row = {
    material_picture?:       string;
    material_id?:            string;
    material_number?:        string;
    material_name?:          string;
    material_category_name?: string;
    barcode?:                string;
    material_model?:         string;
    material_help_code?:     string;
    material_is_asst_attr?:  boolean;
    material_is_batch?:      boolean;
    material_is_kf_period?:  boolean;
    material_brand_name?:    string;
    aux_prop_id?:            string;
    aux_prop_name?:          string;
    batch_no?:               string;
    kf_period?:              string;
    kf_type?:                string;
    valid_date?:             string;
    kf_date?:                string;
    base_unit_id?:           string;
    stock_id?:               string;
    stock_number?:           string;
    stockid_name?:           string;
    stock_is_allow_freight?: boolean;
    aux_unit_id?:            string;
    aux_unit_name?:          string;
    cost?:                   null;
    unit_cost?:              null;
    retail_price?:           null;
    retail_amount?:          number;
    purchase_price?:         null;
    purchase_amount?:        number;
    trade_price?:            null;
    trade_amount?:           number;
    qty?:                    number;
    aux_qty?:                number;
    pkg_qty?:                string;
    valid_qty?:              number;
    valid_aux_qty?:          number;
    pkg_valid_qty?:          string;
    sp_id?:                  string;
    sp_number?:              string;
    sp_name?:                string;
}

export type Sum = {
    material_num?:    string;
    qty?:             string;
    valid_qty?:       string;
    aux_qty?:         string;
    retail_amount?:   string;
    trade_amount?:    string;
    purchase_amount?: string;
    cost?:            string;
}
