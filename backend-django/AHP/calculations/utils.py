def calc_medium_global_priority_expert_calcs(calcs_experts):
    count_experts, summ_gp_of_experts_calcs = 0, []
    for i in range(len(calcs_experts)):
        gp = calcs_experts[i].calc_global_priorities
        count_experts += 1
        
        for j in range(1, len(gp)):
            if i == 0:
                summ_gp_of_experts_calcs.append(float(gp[f"{j}"][-2]))
            else:
                summ_gp_of_experts_calcs[j - 1] = summ_gp_of_experts_calcs[
                    j - 1
                ] + float(gp[f"{j}"][-2])

    medium_gp_of_experts_calcs = list(
        map(lambda x: x / len(calcs_experts), summ_gp_of_experts_calcs)
    )
    sorted_medium_gp_of_experts_calcs = sorted(medium_gp_of_experts_calcs, reverse=True)

    res = []
    for i in range(len(medium_gp_of_experts_calcs)):
        rank = (
            sorted_medium_gp_of_experts_calcs.index(medium_gp_of_experts_calcs[i]) + 1
        )
        res.append([format(medium_gp_of_experts_calcs[i], ".3f"), rank])

    return count_experts, res
